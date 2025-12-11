import { useCodeStore } from "../../stores/dqm/dqm.store.mts";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Typography } from "antd";
import style from "./SanitizedNodeList.module.css";
import { Scroller } from "../scroller/Scroller";
import { useEffect, useState } from "react";
import type { ParseResult } from "../../utils/dqm.utils.types.mts";
import { parseRaw } from "../../utils/dqm.utils.mts";
import { useErrorBoundary } from "react-error-boundary";

function useSanitizedAst(): ParseResult | null {
  const code = useCodeStore();
  const [nodes, setNodes] = useState<ParseResult | null>(null);
  useEffect(() => {
    setNodes(parseRaw(code));
  }, [
    code.views,
    code.astDragProps,
    code.astLineageProps,
    code.astNoDragProps,
  ]);

  return nodes;
}

export const SanitizedNodeList = () => {
  const sanitized = useSanitizedAst();
  const boundary = useErrorBoundary();

  if (sanitized === null) {
    return <h1>null</h1>;
  }

  if (sanitized.state === "fail") {
    boundary.showBoundary(sanitized.error);
    return null;
  }
  const nodes = sanitized.data.sanitized;

  if (!nodes.length) {
    return (
      <div className={style.nope}>
        <div>
          <Typography.Title level={2}>No Theater Set</Typography.Title>
          <Typography>
            Create a theater in the <Typography.Text code>Dqm</Typography.Text>{" "}
            panel to start
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <Typography.Title className={style.title} level={3}>
        Node / Ast
      </Typography.Title>
      {nodes.map(({ theater, sanitized }) => (
        <div key={theater}>
          <Typography.Title code className={style.theaterTitle} level={3}>
            {theater}
          </Typography.Title>
          <Scroller className="padding-inline" direction="horizontal">
            <NodeDisplay
              parentUnique={undefined}
              node={sanitized}
              path=""
              depth={0}
              index={0}
            />
          </Scroller>
        </div>
      ))}
    </>
  );
};
