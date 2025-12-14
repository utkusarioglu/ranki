import { SaveOutlined } from "@ant-design/icons";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Button, Flex } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
// import { MenuDrawer } from "./MenuDrawer";

export const DqmInputOptions = () => {
  const code = useDqmStore();
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
          {code.autoUpdate ? (
            <BlockySwitch
              size="large"
              checkedChildren={"Defer"}
              unCheckedChildren={"No Defer"}
              onChange={() => code.setDeferParsing(!code.deferParsing)}
              value={code.deferParsing}
            />
          ) : (
            <Button onClick={() => code.parseInput()}>Update</Button>
          )}
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
      {/* <MenuDrawer /> */}
    </div>
  );
};
