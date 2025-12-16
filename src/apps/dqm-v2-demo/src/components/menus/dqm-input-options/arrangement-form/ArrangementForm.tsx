import { useUiStore } from "_stores/ui/ui.store.mjs";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button } from "antd";

export const ArrangementForm = () => {
  const ui = useUiStore();
  return (
    <MenuFormItem label="Arrangement">
      <Button
        size="small"
        onClick={() =>
          ui.setTemplateDrawerState({
            type: "arrangement",
            index: 0,
          })
        }
      >
        Load
      </Button>
      <Button size="small">Save</Button>
    </MenuFormItem>
  );
};
