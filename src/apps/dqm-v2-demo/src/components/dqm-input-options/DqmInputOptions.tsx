import { useCodeStore } from "../../stores/dqm/dqm.store.mts";
import { Button, Flex, Switch } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { SaveOutlined } from "@ant-design/icons";
import { TemplatesDrawer } from "./TemplatesDrawer";
import { useUiStore } from "../../stores/ui/ui.store.mts";
import { BlockySwitch } from "../blocky-switch/BlockySwitch";

export const DqmInputOptions = () => {
  const code = useCodeStore();
  const ui = useUiStore();

  return (
    <div className={style.container}>
      <div className={style.arrangement}>
        <Flex>
          <Button
            onClick={() =>
              ui.setTemplateDrawerState({
                type: "arrangement",
                index: 0,
              })
            }
          >
            Load Arrangement
          </Button>
          <Button>
            <SaveOutlined />
          </Button>
        </Flex>
        <Flex>
          <BlockySwitch
            size="large"
            checkedChildren={"Update"}
            unCheckedChildren={"No Update"}
            onChange={(e) => code.setAutoUpdate(e)}
            value={code.autoUpdate}
          />
          {!code.autoUpdate ? (
            <Button onClick={() => code.setAllViewsFromInputs()}>Update</Button>
          ) : null}
        </Flex>
      </div>

      <div>
        {code.inputs.map((t, i) => (
          <DqmInputCard key={t.theater} index={i} />
        ))}
      </div>
      <Button style={{ width: "100%" }} onClick={() => code.pushNewTheater()}>
        Add New Theater
      </Button>
      <TemplatesDrawer />
    </div>
  );
};
