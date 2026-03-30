import {
  filterIds,
  useAstViewStore,
} from "_stores/ast-view/ast-view.store.mts";
// import { createSanitized } from "_stores/ast-view/utils/sanitized-ast-node.mts";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { Typography } from "antd";
import { useErrorBoundary } from "react-error-boundary";
import { AstNodeDisplay } from "./ast-node-display/NodeDisplay";
import { Scroller } from "_views/scroller/Scroller";
import style from "./SanitizedAstNodeListDisplay.module.css";
import { createSanitizedAst } from "@dqm/package-dqm-v2-debug";

function useSanitizedAst() {
  const parsed = useDqmStore((s) => s.parsed);
  const props = useAstViewStore((s) => s.props);
  const children = useAstViewStore((s) => s.children);
  const stable = useAstViewStore((s) => s.stable);
  const hidden = useAstViewStore((s) => s.hidden);
  const filtered = filterIds({
    props,
    children,
    stable,
    // @ts-expect-error
    hidden,
  });
  return createSanitizedAst(
    parsed,
    // @ts-expect-error
    filtered,
  );
  // return createSanitized(parsed, { props, children, stable, hidden });
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
    <div className={style.container}>
      <Typography.Title className={style.title} level={3}>
        Node / Ast
      </Typography.Title>
      {nodes.map(({ theater, sanitized }) => (
        <div key={theater}>
          <Typography.Title code className={style.theaterTitle} level={3}>
            {theater}
          </Typography.Title>
          <Scroller className="padding-inline" direction="horizontal">
            <AstNodeDisplay
              parentUnique={undefined}
              node={sanitized}
              path=""
              depth={0}
              index={0}
            />
          </Scroller>
        </div>
      ))}
    </div>
  );
};
