import v from "./vertical-scroller.css?raw";
export function createVerticalScroller(attach) {
    // const style = document.createElement("style");
    // style.className = "vertical-scroller";
    // style.innerHTML = v;
    // attach.appendChild(style);
    const container = document.createElement("ranki-vertical-scroller");
    container.classList.add("container");
    attach.appendChild(container);
    const element = document.createElement("ranki-vertical-scroller");
    element.classList.add("scroller");
    container.appendChild(element);
    return {
        element,
        css: [
            {
                id: "vertical-scroller",
                css: v,
            },
        ],
    };
}
