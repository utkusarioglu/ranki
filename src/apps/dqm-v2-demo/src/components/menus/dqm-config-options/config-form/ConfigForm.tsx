import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button } from "antd";

export const ConfigForm = () => {
  const dqm = useDqmStore();

  return (
    <MenuFormItem label="Config">
      <Button block onClick={() => dqm.pushNewConfig()}>
        Add New
      </Button>
    </MenuFormItem>
  );
};
