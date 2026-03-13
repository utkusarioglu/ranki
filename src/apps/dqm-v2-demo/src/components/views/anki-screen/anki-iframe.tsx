import { type FC, type RefObject } from "react";
import { assertExists } from "_assertions";
import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import style from "./AnkiIFrame.module.css";
import { createCardElements, createRankiElements } from "./utils";
import type { RankiFiles } from "./AnkiScreen";
import type {
  RankiCard,
  RankiCardType,
  RankiConfigString,
  RankiDeckString,
  RankiFace,
  RankiFlag,
  RankiTagString,
} from "_stores/anki-dist/anki.store.types.mjs";

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
      key={""}
      // ref={ref}
      className={style.container}
      src={src}
      onLoad={(e) => {
        // @ts-expect-error
        ref.current = e.target;
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
            console.log("data", me);
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
            // html.setAttribute("data-bs-theme", "light");
            // html.classList.add("scheme-light");
            // const body = ref.current?.contentDocument!.querySelector("body")!;
            // body.setAttribute("data-bs-theme", "light");
            // body.classList.add("light_mode");
            // console.log("c", body.className);

            // const fields = (e as CustomEvent).detail;
            // Object.entries(fields).forEach(([n, v]) =>
            //   setField(n, v as string),
            // );

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
