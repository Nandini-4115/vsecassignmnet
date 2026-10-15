
function openBoxes() {
    let container = document.querySelector(".container");

    if (container.classList.contains("open")) {
        return;
    }

    container.classList.add("open");

    setTimeout(function() {
        container.classList.remove("open");
    }, 1000);
}
