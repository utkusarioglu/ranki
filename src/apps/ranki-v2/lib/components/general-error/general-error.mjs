export function createAppErrorScreen(error) {
    const container = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Error";
    container.appendChild(h1);
    const pre = document.createElement("pre");
    container.appendChild(pre);
    pre.innerHTML = JSON.stringify(error.toExtendedJSON(), null, 2);
    // root.appendChild(container);
    return {
        element: container,
    };
}
