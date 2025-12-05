import {
  Button,
  InputGroup,
  TextArea,
  H3,
  FormGroup,
  EntityTitle,
  Tabs,
  Tab,
  TabPanel,
  type TabId,
  Label,
} from "@blueprintjs/core";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { useUiStore } from "../../stores/ui.store.mts";
import s from "./controls.module.scss";
import type { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated/16px/blueprint-icons-16";
import { useId, useState } from "react";
import { ReorderList } from "../reorder-list/ReorderList";

interface TextTemplates {
  icon: BlueprintIcons_16Id;
  title: string;
  description: string;
  raw: string;
}

const TEXT_TEMPLATES: TextTemplates[] = [
  {
    icon: "new-text-box",
    title: "Hello world",
    description: "Two words",
    raw: "Hello World",
  },
  {
    icon: "numerical",
    title: "Integer",
    description: "Basic integer parsing",
    raw: "1 234",
  },
  {
    icon: "code",
    title: "Code block",
    description: "Basic code block",
    raw:
      `
[code
hi 
]
    `.trim() + "\n",
  },
];

export const Controls = () => {
  const ui = useUiStore();
  const TABS_PARENT_ID = useId();
  const [selectedTabId, setSelectedTabId] = useState<TabId>("input");

  return (
    <div className="cover-container">
      <div className={s.titleRow}>
        <H3>Dqm v2</H3>
        <Button onClick={ui.closeDrawer} icon="cross" aria-label="close" />
      </div>

      <Tabs
        id={TABS_PARENT_ID}
        onChange={setSelectedTabId}
        selectedTabId={selectedTabId}
      >
        <Tab id="input" title="Input" icon="new-text-box" />
        <Tab id="settings" title="Settings" icon="settings" />
        <Tab id="plugins" title="Plugins" icon="box" />
      </Tabs>
      <TabPanel
        id="input"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<DqmInput />}
      />
      <TabPanel
        id="settings"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<ObjectSanitizer />}
      />
      <TabPanel
        id="plugins"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<p>plugins</p>}
      />
    </div>
  );
};

const ObjectSanitizer = () => {
  return (
    <>
      <Label>Node Properties</Label>
      <ReorderList list="dragProps" method="setDragFeature" allowDragging />
      <Label>Linage Properties</Label>
      <ReorderList
        list="lineageProps"
        method="setLineageFeature"
        allowDragging
      />
      <Label>Other Properties</Label>
      <ReorderList
        list="noDragProps"
        method="setNoDragFeature"
        allowDragging={false}
      />
    </>
  );
};

const DqmInput = () => {
  const code = useCodeStore();
  return (
    <FormGroup label="Theater">
      <InputGroup />
      <TextArea
        className={s.codeInputTextArea}
        fill
        autoResize
        onChange={(e) => code.setTheaterDqms("default", e.target.value)}
        value={code.inputs.dqms["default"]}
      />
      {TEXT_TEMPLATES.map(({ raw, title, description, icon }) => (
        <Button
          key={title}
          onClick={() => code.setTheaterDqms("default", raw)}
          fill
          alignText="start"
        >
          <EntityTitle icon={icon} title={title} subtitle={description} />
        </Button>
      ))}
    </FormGroup>
  );
};
