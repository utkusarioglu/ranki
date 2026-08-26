import {
  filterIds,
  useAstViewStore,
} from "_stores/ast-view/ast-view.store.mts";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { Scroller } from "_views/scroller/Scroller";
import { createFilteredAst } from "@dqm/package-dqm-v2-debug";
import { Typography } from "antd";
import { useErrorBoundary } from "react-error-boundary";

import { AstNodeDisplay } from "./ast-node-display/NodeDisplay";
import style from "./SanitizedAstNodeListDisplay.module.css";

function useSanitizedAst() {
  const parsed = useDqmStore((s) => s.parsed);
  const props = useAstViewStore((s) => s.props);
  const children = useAstViewStore((s) => s.children);
  const stable = useAstViewStore((s) => s.stable);
  const hidden = useAstViewStore((s) => s.hidden);
  const filtered = filterIds({
    children,
    hidden,
    props,
    stable,
  });
  return createFilteredAst(parsed, filtered);
}

export const SanitizedNodeList = () => {
  const sanitized = useSanitizedAst();
  const boundary = useErrorBoundary();

  if (sanitized.state === "fail") {
    boundary.showBoundary(sanitized.error);
    return null;
  }

  const nodes = sanitized.data;

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
      {nodes.map(({ sanitized, theater }) => (
        <div key={theater}>
          <Typography.Title className={style.theaterTitle} code level={3}>
            {theater}
          </Typography.Title>
          <Scroller className="padding-inline" direction="horizontal">
            <AstNodeDisplay
              depth={0}
              index={0}
              node={sanitized}
              parentUnique={undefined}
              path=""
            />
          </Scroller>
        </div>
      ))}
    </div>
  );
};
