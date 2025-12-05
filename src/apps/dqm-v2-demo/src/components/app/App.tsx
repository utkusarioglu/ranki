import {
  BlueprintProvider,
  Button,
  Drawer,
  H1,
  NonIdealState,
} from "@blueprintjs/core";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { useUiStore } from "../../stores/ui.store.mts";
import s from "./app.module.scss";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Controls } from "../controls/Controls";

function App() {
  const ui = useUiStore();

  return (
    <BlueprintProvider>
      <div className={[s.root, "bp6-dark", "fill-container"].join(" ")}>
        <Button onClick={ui.openDrawer}>Open</Button>
        <Drawer
          className="bp6-dark"
          isOpen={ui.isDrawerOpen}
          position="left"
          size={ui.drawerWidth}
          hasBackdrop={false}
          enforceFocus={true}
        >
          <Controls />
        </Drawer>

        <div
          style={{
            marginLeft: ui.isDrawerOpen ? ui.drawerWidth : 0,
            transitionDuration: "0.5s",
            transitionProperty: "margin-left",
          }}
        >
          <SanitizedNodeList />
        </div>
      </div>
    </BlueprintProvider>
  );
}

const SanitizedNodeList = () => {
  const code = useCodeStore();

  if (!code.sanitizedAst.length) {
    return <NonIdealState>No Theaters</NonIdealState>;
  }

  return (
    <>
      {code.sanitizedAst.map(({ theater, sanitized }) => (
        <div key={theater}>
          <H1>{theater}</H1>
          <NodeDisplay node={sanitized} path="" depth={0} index={0} />
        </div>
      ))}
    </>
  );
};

export default App;
