import type { RankiComponent } from "../../types/ranki-component.types.mts";
import type { RenderRoots } from "@dqm/package-dqm-v2";
import "./faces.css";
import { createHr } from "../hr/hr.mts";
import { createVr } from "../vr/vr.mts";
import type { CardFaceArray } from "../../config/collect/collect.types.mts";
// import css from "./faces.css?raw";

function createContainer() {
  const CONTAINER_NAME = "ranki-v2-face-container";
  const c = document.querySelector(`div.${CONTAINER_NAME}`) as HTMLDivElement;
  if (c) {
    return c;
  }
  const faceContainer = document.createElement("div");
  faceContainer.classList.add(CONTAINER_NAME);
  return faceContainer;
}

/**
 * @dev
 * #1 Notice that this is created in the same loop and appended to the dom
 * element but it's not pushed into the faces array. because it's not a face
 * #2 TODO this needs to be tied to an option that can turn hr on and off.
 */
export function createFaces(selectedFaces: CardFaceArray): RankiComponent {
  const faceContainer = createContainer();
  const faces: RenderRoots = Object.fromEntries(
    selectedFaces
      .map((faceName, i) => {
        switch (faceName) {
          case "ranki:hr":
            createHr(faceContainer, i);
            break;
          case "ranki:vr":
            createVr(faceContainer, i);
            break;
          default:
            const NAME = "ranki-v2-face";
            const d = document.querySelector(`.${NAME}.${faceName}`);
            if (d) {
              return [faceName, d];
            }
            const container = document.createElement("div");
            container.classList.add(NAME, faceName);
            faceContainer.appendChild(container);
            return [faceName, container];
        }
      })
      .filter((v) => v !== undefined),
  );
  return {
    element: faceContainer,
    objects: {
      faces,
    },
  };
}
