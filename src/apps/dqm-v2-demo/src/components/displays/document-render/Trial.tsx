import {
  memo,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type RefObject,
} from "react";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Audio from "@dqm/plugin-frame-v2-audio";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import sreMusic from "@dqm/plugin-sre-music";
import staticRender from "@dqm/plugin-static-render-engine";
import { Dqm } from "@dqm/package-dqm-v2";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { assertExists } from "_assertions";
import iframeSrc from "./iframe.html?raw";
import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

function dqmOnLoad(
  doc: Document,
  pluginSelection: PluginStoreWrapper[],
  inputs: DqmParseInputStructured,
) {
  console.log("run");
  const a = doc.querySelector<HTMLDivElement>("#A");
  if (!a) {
    console.log("no luck");
    return;
  }
  const fixedConfig = buildPluginSelectionConfig(pluginSelection);
  const dqm = new Dqm(
    [fixedConfig],
    [
      staticRender,
      baseV2,
      frameV2,
      frameV2Code,
      paramsV2,
      frameV2Html,
      frameV2Audio,
      sreMusic,
    ],
  );
  // console.log(doc.querySelector("body"));
  // console.log(a);
  assertExists(a, {
    why: "body element has to be available for dqm to render",
  });
  dqm.render(inputs, { [inputs[0].theater]: a }, { scheme: "dark" });
}

const s = useDqmStore.getState();

export const TrialRender = () => {
  const ref = useRef<HTMLIFrameElement>(null);

  const ifa = useMemo(
    () => (
      <iframe
        ref={ref}
        style={{ width: 250, height: 400, border: "none" }}
        srcDoc={iframeSrc}
        // onLoad={() => {
        //   console.log("ready");
        //   if(!ref.current)
        //   setReady(ref.current?.contentDocument);
        // }}
        onLoad={() => {
          const doc = ref.current?.contentDocument;
          assertExists(doc, { why: "doc is needed" });
          console.log("RERENDER");
          dqmOnLoad(doc, s.pluginSelection, s.inputs);
        }}
      />
    ),
    [],
  );

  return (
    <div>
      <div key="stable">{ifa}</div>
    </div>
  );
};

interface ControllerProps {
  ref: RefObject<HTMLIFrameElement | null>;
  doc: Document | null;
}

const Controller: FC<ControllerProps> = ({ doc, ref }) => {
  const d = useDqmStore();
  useEffect(() => {
    // if (!ref.current) {
    //   return;
    // }
    // const doc = ref.current.contentDocument;
    if (!doc) {
      return;
    }

    dqmOnLoad(doc, d.pluginSelection, d.inputs);

    // ref.current.addEventListener("load", loaded);

    // return () => doc.removeEventListener("load", loaded);
  }, [doc, d.inputs]);

  return null;
};

// export const TrialRender = () => {
//   const d = useDqmStore();
//   // const r = useRef<HTMLIFrameElement>(null);
//   const ref = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const doc = ref.current;
//     if (!doc) return;
//     if (!doc.contentDocument) return;

//     dqmOnLoad(doc.contentDocument, d.pluginSelection, d.inputs);
//   }, [d.inputs, d.pluginSelection]);

//   return (
//     <div key="stable-iframe">
//       <IframeHost
//         ref={ref}
//         onReady={(doc) => {
//           // console.log(doc);
//           // dqmOnLoad(doc, d.pluginSelection, d.inputs);
//         }}
//       />
//     </div>
//   );
// };

const IframeHost = memo(function IframeHost({
  ref,
  onReady,
}: {
  onReady: (doc: Document) => void;
  ref: RefObject<HTMLIFrameElement | null>;
}) {
  return (
    <iframe
      ref={ref}
      srcDoc={iframeSrc}
      onLoad={() => {
        const doc = ref.current?.contentDocument;
        if (doc) onReady(doc);
      }}
      style={{ width: 250, height: 400, border: "none" }}
    />
  );
});
