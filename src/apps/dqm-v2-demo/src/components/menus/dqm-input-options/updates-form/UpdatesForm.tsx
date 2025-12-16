import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button, Flex, Form } from "antd";

export const UpdatesForm = () => {
  const dqm = useDqmStore();
  return (
    <MenuFormItem label="Updates">
      <BlockySwitch
        size="small"
        checkedChildren={"Auto"}
        unCheckedChildren={"Manual"}
        onChange={(e) => dqm.setAutoUpdate(e)}
        value={dqm.autoUpdate}
      />
      {dqm.autoUpdate ? (
        <BlockySwitch
          size="small"
          checkedChildren={"Deferred"}
          unCheckedChildren={"Synchronous"}
          onChange={() => dqm.setDeferParsing(!dqm.deferParsing)}
          value={dqm.deferParsing}
        />
      ) : (
        <Button onClick={() => dqm.parseInput()}>Update</Button>
      )}
    </MenuFormItem>
  );
};
