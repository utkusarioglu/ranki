import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button } from "antd";

export const UpdatesForm = () => {
  const dqm = useDqmStore();
  return (
    <MenuFormItem label="Updates">
      <BlockySwitch
        checkedChildren={"Auto"}
        onChange={(e) => dqm.setAutoUpdate(e)}
        size="small"
        unCheckedChildren={"Manual"}
        value={dqm.autoUpdate}
      />

      {dqm.autoUpdate ? (
        <BlockySwitch
          checkedChildren={"Deferred"}
          onChange={() => dqm.setDeferParsing(!dqm.deferParsing)}
          size="small"
          unCheckedChildren={"Synchronous"}
          value={dqm.deferParsing}
        />
      ) : (
        <Button onClick={() => dqm.parseInput()} size="small">
          Update
        </Button>
      )}
    </MenuFormItem>
  );
};
