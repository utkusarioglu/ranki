import {
  BlueprintProvider,
  Button,
  TextArea,
  Drawer,
  H3,
  EntityTitle,
  Text,
  FormGroup,
  H6,
  H4,
  H5,
} from "@blueprintjs/core";
import { useCodeStore } from "../../stores/code.store.mts";
import { useUiStore } from "../../stores/ui.store.mts";
import s from "./app.module.scss";
import { NodeDisplay } from "../node-display/NodeDisplay";
import { Controls } from "../controls/Controls";

// const TEXT_TEMPLATES = [
//   {
//     title: "Hello world",
//     description: "Two words",
//     raw: "Hello Wordl",
//   },
//   {
//     title: "Integer",
//     description: "Basic integer parsing",
//     raw: "1 234",
//   },
//   {
//     title: "Code block",
//     description: "Basic code block",
//     raw:
//       `
// [code
// hi
// ]
//     `.trim() + "\n",
//   },
// ];

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
          <NodeDisplay node={code.sanitized} path="" depth={0} index={0} />
        </div>
      </div>
    </BlueprintProvider>
  );
}

export default App;
