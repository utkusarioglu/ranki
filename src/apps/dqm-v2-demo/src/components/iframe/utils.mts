export function pushStyle(e: Document, id: string, style: string) {
  if (!e.querySelector(`style#${id}`)) {
    const sc = e.createElement("style");
    sc.id = id;
    sc.innerHTML = style;
    e.head.appendChild(sc);
  }
}

export function pushScript(e: Document, id: string, script: string) {
  if (!e.querySelector(`script.${id}-observer`)) {
    const sc = e.createElement("script");
    sc.className = id + "-observer";
    sc.innerHTML = `const id = "${id}";\n` + script;
    e.head.appendChild(sc);
  }
}
