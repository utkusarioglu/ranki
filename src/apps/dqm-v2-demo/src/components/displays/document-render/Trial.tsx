import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

import { assertNotUndefined } from "_assertions";
import { pluginsAsArray } from "_stores/dqm/dqm.plugins.mjs";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { Dqm } from "@dqm/package-dqm-v2";
import { useMemo, useRef } from "react";

import iframeSrc from "./iframe.html?raw";

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
  assertNotUndefined(a, {
    why: "body element has to be available for dqm to render",
  });
  // @ts-expect-error
  dqm.render(inputs, { [inputs[0].theater]: a }, { scheme: "dark" });
}

const s = useDqmStore.getState();

export const TrialRender = () => {
  const ref = useRef<HTMLIFrameElement>(null);

  const ifa = useMemo(
    () => (
      <iframe
        // onLoad={() => {
        //   console.log("ready");
        //   if(!ref.current)
        //   setReady(ref.current?.contentDocument);
        // }}
        onLoad={() => {
          const doc = ref.current?.contentDocument;
          assertNotUndefined(doc, { why: "doc is needed" });
          dqmOnLoad(doc, s.pluginSelection, s.inputs);
        }}
        ref={ref}
        srcDoc={iframeSrc}
        style={{ border: "none", height: 400, width: 250 }}
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
