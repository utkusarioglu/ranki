import type { CardFaceArray } from "../../collect/collect.types.mts";
import type { RankiComponent } from "../../types/ranki-component.types.mts";
import type { RenderRoots } from "@dqm/package-dqm-v2";
import css from "./faces.css?raw";

/**
 * @dev
 * #1 Notice that this is created in the same loop and appended to the dom
 * element but it's not pushed into the faces array. because it's not a face
 * #2 TODO this needs to be tied to an option that can turn hr on and off.
 */
export function createFaces(selectedFaces: CardFaceArray): RankiComponent {
  const faceContainer = document.createElement("div");
  faceContainer.classList.add("ranki-v2-face-container");
  const faces: RenderRoots = Object.fromEntries(
    selectedFaces.map((f, i, a) => {
      const container = document.createElement("div");
      container.classList.add("ranki-v2-face");
      faceContainer.appendChild(container);
      // #1 #2
      if (a.length - 1 > i) {
        const hr = document.createElement("hr");
        hr.classList.add("ranki-v2-hr");
        faceContainer.appendChild(hr);
      }
      return [f, container];
    }),
  );
  return {
    element: faceContainer,
    objects: {
      faces,
    },
    css: [
      {
        id: "face",
        css,
      },
    ],
  };
}
