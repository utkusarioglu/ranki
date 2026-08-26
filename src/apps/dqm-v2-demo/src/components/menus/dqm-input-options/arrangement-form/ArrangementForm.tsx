import { useUiStore } from "_stores/ui/ui.store.mjs";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";
import { Button } from "antd";

export const ArrangementForm = () => {
  const ui = useUiStore();
  return (
    <MenuFormItem label="Arrangement">
      <Button
        onClick={() =>
          ui.setTemplateDrawerState({
            index: 0,
            type: "arrangement",
          })
        }
        size="small"
      >
        Load
      </Button>
      <Button size="small">Save</Button>
    </MenuFormItem>
  );
};
