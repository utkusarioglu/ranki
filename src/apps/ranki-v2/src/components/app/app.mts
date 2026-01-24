import { createFaces } from "../faces/faces.mts";
import type { RankiAppConfig } from "../../config/config.types.mts";

export function createApp(config: RankiAppConfig, root: HTMLElement) {
  const facesNode = createFaces(config.order);
  [facesNode].forEach((n) => {
    document.body.appendChild(n.element);
  });

  [facesNode]
    .map((n) => n.css)
    .filter((v) => v !== undefined)
    .flat()
    .forEach((c) => {
      const e = document.createElement("style");
      e.id = c.id;
      e.innerHTML = c.css;
      document.body.appendChild(e);
    });

  return { roots: facesNode.objects!["faces"] };
}
