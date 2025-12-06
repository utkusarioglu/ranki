import { useCodeStore } from "../../stores/code/code.store.mts";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Typography } from "antd";
import style from "./SanitizedNodeList.module.css";
import { Scroller } from "../scroller/Scroller";

export const SanitizedNodeList = () => {
  const code = useCodeStore();

  if (!code.sanitizedAst.length) {
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
      {code.sanitizedAst.map(({ theater, sanitized }) => (
        <div key={theater}>
          <Typography.Title code className={style.theaterTitle} level={3}>
            {theater}
          </Typography.Title>
          <Scroller className="padding-inline" direction="horizontal">
            <NodeDisplay node={sanitized} path="" depth={0} index={0} />
          </Scroller>
        </div>
      ))}
    </>
  );
};
