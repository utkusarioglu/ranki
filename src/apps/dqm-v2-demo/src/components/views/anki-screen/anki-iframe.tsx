import { useRef, type FC } from "react";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { assertExists } from "_assertions";
import type {
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";
import style from "./AnkiIFrame.module.css";
import { createCardElements, dqmOnLoad } from "./utils";
import type { RankiFiles } from "./AnkiScreen";
const s = useDqmStore.getState();

interface AnkiDesktopIFrameProps {
  inputs: DqmParseInputStructured;
  pref: IDqmRendererClientPreferences;
  files: RankiFiles;
  src: string;
}

export const AnkiIFrame: FC<AnkiDesktopIFrameProps> = ({
  inputs,
  pref,
  files,
  src,
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const replaced = createCardElements(files, {
    // These need to be replaced in the demo app
    "{{FACE}}": "A",
    "{{TEMPLATE_CONFIG}}": "   ",
    // These come from anki
    "{{CardConfig}}": "   ",
    "{{A}}": inputs[0].dqm,
    "{{B}}": "[code|hi]",
    "{{Deck}}": "Tests::Test",
    "{{Subdeck}}": "Test",
    "{{Tags}}": "    ",
    "{{Type}}": "A",
    "{{CardFlag}}": "flag0",
    "{{Card}}": "card",
  });

  return (
    <>
      <iframe
        ref={ref}
        className={style.container}
        // style={{ width: size[0], height: size[1] }}
        style={{ width: "100%", height: "100%" }}
        src={src}
        onLoad={() => {
          const doc = ref.current?.contentDocument!;
          assertExists(doc, { why: "doc is needed" });
          const base = doc.querySelector("base") as HTMLBaseElement;
          if (base) {
            base.href = window.location.origin;
          }
          doc.body.appendChild(replaced.fragment);

          replaced.css.forEach((css) => {
            doc.body.appendChild(css);
          });
          replaced.jss.forEach((js) => {
            doc.body.appendChild(js);
          });
          dqmOnLoad(doc, s.pluginSelection, s.inputs, pref);
        }}
      />
    </>
  );
};
