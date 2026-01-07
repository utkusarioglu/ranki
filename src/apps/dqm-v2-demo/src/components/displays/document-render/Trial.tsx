import { useEffect, useRef } from "react";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import staticRender from "@dqm/plugin-static-render-engine";
import { Dqm } from "@dqm/package-dqm-v2";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";

export const TrialRender = () => {
  const d = useDqmStore();
  const r = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!r.current) {
      return;
    }

    const fixedConfig = buildPluginSelectionConfig(d.pluginSelection);
    // const ren = new DqmStaticRenderer();
    // ren.addPlugin();
    const dqm = new Dqm(
      [fixedConfig],
      [staticRender, baseV2, frameV2, frameV2Code, paramsV2, frameV2Html],
    );
    dqm.render(
      d.inputs,
      { [d.inputs[0].theater]: r.current },
      { scheme: "dark" },
    );
  }, [d.inputs]);

  return (
    <div>
      <div ref={r} />
    </div>
  );
};
