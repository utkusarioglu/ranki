import { BlueprintProvider, Button, Drawer, H1 } from "@blueprintjs/core";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { useUiStore } from "../../stores/ui.store.mts";
import s from "./app.module.scss";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Controls } from "../controls/Controls";

function App() {
  const code = useCodeStore();
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
          {Object.entries(code.processed.sanitized).map(([theater, node]) => (
            <div key={theater}>
              <H1>{theater}</H1>
              <NodeDisplay node={node} path="" depth={0} index={0} />
            </div>
          ))}
        </div>
      </div>
    </BlueprintProvider>
  );
}

export default App;
