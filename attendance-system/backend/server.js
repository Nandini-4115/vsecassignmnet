
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/attendance_system")
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch(error => {
    console.log("Database Error:", error.message);
  });

// Student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  }
});

const Student = mongoose.model("Student", studentSchema);

// Attendance schema
const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true
  }
});

attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

// Demo login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({
      success: true,
      message: "Login successful"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNo: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add student
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo } = req.body;

    if (!name || !rollNo) {
      return res.status(400).json({
        error: "Enter student name and roll number."
      });
    }

    const student = await Student.create({
      name: name.trim(),
      rollNo: rollNo.trim()
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "This roll number already exists."
      });
    }

    res.status(500).json({ error: error.message });
  }
});

// Get attendance by date
app.get("/attendance", async (req, res) => {
  try {
    if (!req.query.date) {
      return res.json([]);
    }

    const records = await Attendance.find({
      date: req.query.date
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update attendance
app.post("/attendance", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (
      !studentId ||
      !mongoose.isValidObjectId(studentId) ||
      !date ||
      !["Present", "Absent"].includes(status)
    ) {
      return res.status(400).json({
        error: "Select a student, date and valid status."
      });
    }

    const studentExists = await Student.exists({
      _id: studentId
    });

    if (!studentExists) {
      return res.status(404).json({
        error: "Student not found."
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { studentId, date },
      { $set: { status } },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
