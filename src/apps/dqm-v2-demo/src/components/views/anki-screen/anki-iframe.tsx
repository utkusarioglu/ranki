import { type FC, type RefObject } from "react";
import { assertExists } from "_assertions";
import style from "./AnkiIFrame.module.css";
import { createRankiElements } from "./utils";
import type { RankiFiles } from "./AnkiScreen";

export interface AnkiDesktopIFrameProps {
  onLoad: () => void;
  // inputs: DqmParseInputStructured;
  // pref: IDqmRendererClientPreferences;
  files: RankiFiles;
  // templateConfig: RankiConfigString;
  // cardConfig: RankiConfigString;
  // tags: RankiTagString;
  // deck: RankiDeckString;
  // flag: RankiFlag;
  src: string;
  // face: RankiFace;
  // cardType: RankiCardType;
  // card: RankiCard;
  ref: RefObject<HTMLIFrameElement | null>;
}

/**
 * @dev
 * #1 FIX this is a stop-gap measure. a better solution for all inputs that
 * don't demand a reload would be much more useful
 */
export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  ref,
  // inputs,
  // pref,
  files,
  src,
  onLoad,
  // cardConfig,
  // templateConfig,
  // tags,
  // deck,
  // flag,
  // face,
  // cardType,
  // card,
}) => {
  const replaced = createRankiElements(files, {
    // These need to be replaced in the demo app
    // "{{FACE}}": face,
    // "{{TEMPLATE_CONFIG}}": templateConfig,
    // "{{STORAGE_CONFIG}}": "/ranki-v2/_ranki2_user_config.yml",
    // These come from anki
    // "{{CardConfig}}": cardConfig,
    // These are created by `inputs`
    // "{{A}}": inputs[0].dqm,
    // "{{B}}": inputs[1].dqm,
    // "{{Card}}": card,
    // "{{Type}}": cardType,
    // "{{Tags}}": tags,
    // "{{Deck}}": deck,
    // "{{Subdeck}}": deck.split("::").at(-1)!,
    // "{{CardFlag}}": flag,
  });

  // const key = [
  //   templateConfig,
  //   cardConfig,
  //   tags,
  //   deck,
  //   cardType,
  //   flag,
  //   face,
  //   card,
  //   pref.scheme,
  // ].join(" ");

  return (
    <iframe
      // #1
      className={style.container}
      src={src}
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

        const mapping: Record<string, string | number> = {
          a: "script.r2-input.A",
          b: "script.r2-input.B",
          face: "script.r2-data.face",
          deck: "script.r2-data.deck",
          tags: "script.r2-data.tags",
          type: "script.r2-data.type",
          flag: "script.r2-data.flag",
          card: "script.r2-data.card",
        };
        (e.target as HTMLIFrameElement).contentWindow!.addEventListener(
          "message",
          (me) => {
            if (me.data.type !== "ranki-update") {
              return;
            }
            const setField = (name: string, value: string | number) => {
              const selector = mapping[name];
              assertExists(selector, { why: "t" });
              const f = qa.querySelector<HTMLScriptElement>(selector)!;
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

            const ren = qa.querySelector("div.rendered");
            assertExists(ren, { why: "Cannot find element" });
            ren.parentElement!.removeChild(ren);
          },
        );

        replaced.css.forEach((css) => {
          doc.body.appendChild(css);
        });
        replaced.jss.forEach((js) => {
          doc.body.appendChild(js);
        });

        onLoad();
      }}
    />
  );
};
