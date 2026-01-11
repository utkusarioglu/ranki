export function cardContent(root: HTMLElement, selectedFaces: string[]) {
  const content = document.createElement("div");
  content.classList.add("ranki-v2-content");
  const faceContainer = document.createElement("div");
  faceContainer.classList.add("ranki-v2-face-container");
  content.appendChild(faceContainer);
  root.appendChild(content);

  const faces = Object.fromEntries(
    selectedFaces.map((f) => {
      const container = document.createElement("div");
      container.classList.add("face");
      faceContainer.appendChild(container);
      return [f, container];
    }),
  );
  return { faces };
}
