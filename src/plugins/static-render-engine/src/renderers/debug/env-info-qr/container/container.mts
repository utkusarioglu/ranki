import type { IDqmRenderPluginRenderer } from "@dqm/package-dqm-api-v2";
// import { randomColor } from "../randomColor.mjs";
// import style from "./container.css?raw";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";

// @ts-expect-error
function getElement<Elem extends HTMLElement = HTMLDivElement>(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.firstChild as Elem;
  return element;
}

export const container: IDqmRenderPluginRenderer = {
  chain: [...TAGS, "container", "block"],
  kind: "parent",
  sync: ({}) => {
    const block = AnkiUi.titledBlock([
      {
        type: "title",
        text: "Environment Info",
      },
      {
        type: "programming-language",
        text: "QR Code",
      },
    ]);
    // block.getMount!().innerText = navigator.userAgent;
    // const element = getElement(html);
    // element.innerText = navigator.userAgent;
    // element.style.borderColor = randomColor(pref.scheme);
    // element.innerText = "(" + ser.source + ")";
    return {
      element: block.element,
      getMount: () => block.getMount!(),
      // afterMount: [
      //   async () => {
      //     const speed = 0.5;
      //     const angle = 360;
      //     let step = 0;
      //     const animation = () => {
      //       step += 1 * speed;
      //       element.style.rotate = step + "deg";
      //       if (step < angle) {
      //         window.requestAnimationFrame(animation);
      //       }
      //     };
      //     window.requestAnimationFrame(animation);
      //   },
      // ],
      // beforeUnmount: [
      //   async () => {
      //     console.log("unmount");
      //   },
      // ],
      css: [
        ...block.css!,
        // {
        //   id: "debug-payload-block",
        //   css: style,
        // },
      ],
    };
  },
  // deferred: async () => {
  //   await new Promise<void>((r) => setTimeout(r, 5000));

  //   return ({ ser, pref }) => {
  //     const element = getElement(html);
  //     element.style.borderColor = randomColor(pref.scheme);
  //     element.innerText = ser.source;
  //     return {
  //       element,
  //       afterMount: [
  //         async () => {
  //           const speed = 5;
  //           const angle = 360 * 3;
  //           let step = 0;
  //           const animation = () => {
  //             step += 1 * speed;
  //             element.style.rotate = step + "deg";
  //             if (step < angle) {
  //               window.requestAnimationFrame(animation);
  //             }
  //           };
  //           window.requestAnimationFrame(animation);
  //         },
  //       ],
  //       beforeUnmount: [
  //         async () => {
  //           console.log("unmount");
  //         },
  //       ],
  //       css: [
  //         {
  //           id: "debug-payload-block",
  //           css: style,
  //         },
  //       ],
  //     };
  //   };
  // },
};
