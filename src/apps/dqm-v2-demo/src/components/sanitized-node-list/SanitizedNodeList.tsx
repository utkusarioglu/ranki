import { useDqmStore } from "../../stores/dqm/dqm.store.mts";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Typography } from "antd";
import style from "./SanitizedNodeList.module.css";
import { Scroller } from "../scroller/Scroller";
import { useErrorBoundary } from "react-error-boundary";
import { useAstViewStore } from "../../stores/ast-view/ast-view.store.mts";
import { createSanitized } from "../../stores/ast-view/utils/sanitized-ast-node.mts";

function useSanitizedAst() {
  const parsed = useDqmStore((s) => s.parsed);
  const props = useAstViewStore((s) => s.props);
  const children = useAstViewStore((s) => s.children);
  const stable = useAstViewStore((s) => s.stable);
  return createSanitized(parsed, { props, children, stable });
}

export const SanitizedNodeList = () => {
  const sanitized = useSanitizedAst();
  const boundary = useErrorBoundary();

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
