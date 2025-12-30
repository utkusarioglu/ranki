import { useEffect, useRef } from "react";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import { Dqm } from "@dqm/package-dqm-v2";
import { DqmStaticRenderer } from "@dqm/package-static-renderer";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";

export const TrialRender = () => {
  const d = useDqmStore();
  const r = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!r.current) {
      return;
    }
    const dqm = new Dqm(
      [],
      [baseV2, frameV2, frameV2Code, paramsV2],
    ).setRenderer(DqmStaticRenderer);
    dqm.render(d.inputs, { [d.inputs[0].theater]: r.current });
  }, [d.inputs]);

  return (
    <div>
      <div ref={r} />
    </div>
  );
};
