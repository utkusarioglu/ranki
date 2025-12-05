import {
  Button,
  InputGroup,
  TextArea,
  H3,
  FormGroup,
  Tabs,
  Tab,
  TabPanel,
  type TabId,
  Label,
  ControlGroup,
  Card,
  EntityTitle,
} from "@blueprintjs/core";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { useUiStore } from "../../stores/ui.store.mts";
import s from "./controls.module.scss";
import { useId, useState, type FC } from "react";
import { ReorderList } from "../reorder-list/ReorderList";

export const Controls = () => {
  const ui = useUiStore();
  const TABS_PARENT_ID = useId();
  const [selectedTabId, setSelectedTabId] = useState<TabId>("input");

  return (
    <div className={["cover-container", s.container].join(" ")}>
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
        <Tab id="view" title="View" icon="settings" />
        <Tab id="plugins" title="Plugins" icon="box" />
      </Tabs>
      <TabPanel
        id="input"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<DqmInputs />}
      />
      <TabPanel
        id="view"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<ViewOptions />}
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

const ViewOptions = () => {
  const TABS_PARENT_ID = useId();
  const [selectedTabId, setSelectedTabId] = useState<TabId>("render");
  return (
    <>
      <Tabs
        id={TABS_PARENT_ID}
        onChange={setSelectedTabId}
        selectedTabId={selectedTabId}
        fill
      >
        <Tab id="render" title="Render" />
        <Tab id="graph" title="Graph" />
        <Tab id="node" title="Node" />
      </Tabs>
      <TabPanel
        id="render"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
      <TabPanel
        id="graph"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
      <TabPanel
        id="node"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NodeOptions />}
      />
    </>
  );
};

const NodeOptions = () => {
  const TABS_PARENT_ID = useId();
  const [selectedTabId, setSelectedTabId] = useState<TabId>("ast");

  return (
    <>
      <Tabs
        id={TABS_PARENT_ID}
        onChange={setSelectedTabId}
        selectedTabId={selectedTabId}
        fill
      >
        <Tab id="ast" title="Ast" />
        <Tab id="cpx" title="Cpx" />
        <Tab id="cps" title="Cps" />
        <Tab id="validation" title="Validation" />
        <Tab id="transform" title="Transform" />
      </Tabs>
      <TabPanel
        id="ast"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<AstSanitizerOptions />}
      />
      <TabPanel
        id="cpx"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
      <TabPanel
        id="cps"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
      <TabPanel
        id="validation"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
      <TabPanel
        id="transform"
        selectedTabId={selectedTabId}
        parentId={TABS_PARENT_ID}
        panel={<NotYet />}
      />
    </>
  );
};

const AstSanitizerOptions = () => {
  return (
    <>
      <Label>Node Properties</Label>
      <ReorderList
        list="astDragProps"
        method="setDragFeatureList"
        allowDragging
      />
      <Label>Linage Properties</Label>
      <ReorderList
        list="astLineageProps"
        method="setLineageFeatureList"
        allowDragging
      />
      <Label>Other Properties</Label>
      <ReorderList
        list="astNoDragProps"
        method="setNoDragFeatureList"
        allowDragging={false}
      />
    </>
  );
};

const NotYet = () => {
  return <p>too early</p>;
};

interface DqmInputProps {
  index: number;
}

const DqmInputs = () => {
  const code = useCodeStore();

  return (
    <>
      <div>
        {code.inputs.map((t, i) => (
          <DqmInput key={t.theater} index={i} />
        ))}
      </div>
      <Button fill onClick={() => code.pushTheater()}>
        Add New Theater
      </Button>
    </>
  );
};

const DqmInput: FC<DqmInputProps> = ({ index }) => {
  const { dqm, theater } = useCodeStore((s) => s.inputs[index]);
  const code = useCodeStore();
  const [tMenu, setTMenu] = useState(false);

  return (
    <FormGroup>
      <ControlGroup>
        <InputGroup
          value={theater}
          onChange={(e) => code.setTheaterNameByIndex(index, e.target.value)}
          fill
        />
        <Button
          icon={tMenu ? "remove" : "add"}
          onClick={() => setTMenu((t) => !t)}
        />
        <Button icon="cross" onClick={() => code.removeTheaterByIndex(index)} />
      </ControlGroup>
      {tMenu &&
        code.textTemplates.map(({ icon, title, raw, description }) => (
          <Card
            className={s.templateItem}
            key={title}
            onClick={() => code.setTheaterDqmByIndex(index, raw)}
          >
            <EntityTitle icon={icon} title={title} subtitle={description} />
          </Card>
        ))}
      <TextArea
        className={s.codeInputTextArea}
        fill
        autoResize
        onChange={(e) => code.setTheaterDqmByIndex(index, e.target.value)}
        value={dqm}
      />
    </FormGroup>
  );
};
