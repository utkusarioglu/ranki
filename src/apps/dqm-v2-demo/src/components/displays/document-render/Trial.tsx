import { useMemo, useRef } from "react";
import { Dqm } from "@dqm/package-dqm-v2";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { assertExists } from "_assertions";
import iframeSrc from "./iframe.html?raw";
import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";
import { pluginsAsArray } from "_stores/dqm/dqm.plugins.mjs";

function dqmOnLoad(
  doc: Document,
  pluginSelection: PluginStoreWrapper[],
  inputs: DqmParseInputStructured,
) {
  const a = doc.querySelector<HTMLDivElement>("#A");
  if (!a) {
    console.log("no luck");
    return;
  }
  const fixedConfig = buildPluginSelectionConfig(pluginSelection);
  console.log("Fixed", JSON.stringify(fixedConfig));
  const dqm = new Dqm([fixedConfig], pluginsAsArray);
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
