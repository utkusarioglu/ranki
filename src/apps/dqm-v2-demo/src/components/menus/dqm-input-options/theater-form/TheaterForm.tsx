import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button } from "antd";

export const TheaterForm = () => {
  const code = useDqmStore();

  return (
    <MenuFormItem label="Theater">
      <Button onClick={() => code.pushNewTheater()} style={{ width: "100%" }}>
        Add New
      </Button>
    </MenuFormItem>
  );
};
