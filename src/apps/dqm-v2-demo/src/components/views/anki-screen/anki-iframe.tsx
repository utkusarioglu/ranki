import { assertExists } from "_assertions";
import { RENDERED_CLASS_SELECTOR } from "@ranki/app-ranki-v2/constants";
import { type FC, type RefObject } from "react";

import type { RankiFiles } from "./AnkiScreen";

import style from "./AnkiIFrame.module.css";
import { createFragment, createRankiElements } from "./utils";

export interface AnkiDesktopIFrameProps {
  files: RankiFiles;
  onLoad: () => void;
  ref: RefObject<HTMLIFrameElement | null>;
  src: string;
  onFetch?: (originalFetch: typeof window.fetch) => typeof window.fetch;
}

/**
 * @dev
 * #1 FIX this is a stop-gap measure. a better solution for all inputs that
 * don't demand a reload would be much more useful
 */
export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  files,
  onLoad,
  ref,
  src,
  onFetch,
}) => {
  const replaced = createRankiElements(files);

  return (
    <iframe
      // #1
      className={style.container}
      onLoad={(e) => {
        ref.current = e.target as HTMLIFrameElement;
        const doc = ref.current?.contentDocument!;
        assertExists(doc, { why: "doc is needed" });
        const base = doc.querySelector("base") as HTMLBaseElement;
        if (base) {
          base.href = window.location.origin;
        }
        const qa = doc.body.querySelector("#qa");
        assertExists(qa, { why: "#qa required for anki webview" });
        qa.replaceChildren(replaced.fragment);

        const mapping: Record<string, string> = {
          a: "script.r2-input.A",
          b: "script.r2-input.B",
          card: "script.r2-data.card",
          deck: "script.r2-data.deck",
          face: "script.r2-data.face",
          flag: "script.r2-data.flag",
          tags: "script.r2-data.tags",
          type: "script.r2-data.type",
        };
        (e.target as HTMLIFrameElement).contentWindow!.addEventListener(
          "message",
          (me) => {
            if (me.data.type !== "ranki-update") {
              return;
            }
            if (me.data.ranki.contentType === "foreign") {
              if (qa) {
                qa.innerHTML = "Foreign Content";
                return;
              }
            } else {
              const fragment = createFragment(files);
              qa.replaceChildren(fragment);
              // qa.innerHTML = "";
            }
            const setField = (name: string, value: string) => {
              const selector = mapping[name];
              // assertExists(selector, { why: "t" });
              let f = qa.querySelector<HTMLScriptElement>(selector)!;
              if (!f) {
                const tag = selector.split(".")[0];
                f = document.createElement(tag) as HTMLScriptElement;
                f.className = selector.split(".")[1];
              }
              assertExists(f, { why: "Cannot find element" });
              f.innerText = value.toString();
            };

            Object.entries(me.data.ranki.fields).forEach(([n, v]) => {
              setField(n, v as string);
            });

            const html = ref.current?.contentDocument!.querySelector("html")!;
            const body = ref.current?.contentDocument!.querySelector("body")!;

            const isDark = me.data.ranki.pref.scheme === "dark";
            if (!isDark) {
              body.classList.remove("night_mode", "nightMode");
              body.classList.add("light_mode", "lightMode");
              html.classList.remove("night-mode");
              html.classList.add("light-mode");
              html.setAttribute("data-bs-theme", "light");
            } else {
              body.classList.add("night_mode", "nightMode");
              body.classList.remove("light_mode", "lightMode");
              html.classList.add("night-mode");
              html.classList.remove("light-mode");
              html.setAttribute("data-bs-theme", "dark");
            }

            const ren = qa.querySelector(RENDERED_CLASS_SELECTOR);
            if (ren) {
              ren.parentElement!.removeChild(ren);
            }
            // assertExists(ren, { why: "Cannot find element" });
          },
        );

        replaced.css.forEach((css) => {
          doc.body.appendChild(css);
        });
        replaced.jss.forEach((js) => {
          doc.body.appendChild(js);
        });

        if (onFetch) {
          const frameWindow = ref.current.contentWindow;
          if (frameWindow) {
            frameWindow.fetch = onFetch(frameWindow.fetch);
            // const frameFetch = frameWindow.fetch;
            // if (frameFetch) {
            //   frameWindow.fetch = (url: string, ...others) => {
            //     // return frameFetch(...args);
            //     // return Promise.reject(new TypeError("Failed to fetch"));
            //     if (["8080", "file-batch"].some((v) => url.includes(v))) {
            //       console.log("fetch override", url, others);
            //       return Promise.resolve(
            //         new Response(JSON.stringify({ hello: "world" }), {
            //           status: 200,
            //           headers: {
            //             "Content-Type": "application/json",
            //           },
            //         }),
            //       );
            //     } else {
            //       return frameFetch(url, ...others);
            //     }
            //   };
            // }
          }
        }
        // const frameWindow = ref.current.contentWindow;
        // if (frameWindow) {
        //   const frameFetch = frameWindow.fetch;
        //   if (frameFetch) {
        //     frameWindow.fetch = (url: string, ...others) => {
        //       // return frameFetch(...args);
        //       // return Promise.reject(new TypeError("Failed to fetch"));
        //       if (["8080", "file-batch"].some((v) => url.includes(v))) {
        //         console.log("fetch override", url, others);
        //         return Promise.resolve(
        //           new Response(JSON.stringify({ hello: "world" }), {
        //             status: 200,
        //             headers: {
        //               "Content-Type": "application/json",
        //             },
        //           }),
        //         );
        //       } else {
        //         return frameFetch(url, ...others);
        //       }
        //     };
        //   }
        // }

        onLoad();
      }}
      src={src}
    />
  );
};
