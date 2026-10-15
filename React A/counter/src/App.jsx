
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState('');

  return (
    <div>
      <h1>Counter App</h1>

      <input
        type="number"
        value={num}
        onChange={(e) => setNum(e.target.value)}
        placeholder="Enter a number"
      />

      <button onClick={() => setCount(Number(num))}>
        Set Number
      </button>

      <h2>Count: {count}</h2>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default App;
