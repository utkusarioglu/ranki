import { SaveOutlined } from "@ant-design/icons";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { Button, Form } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { UpdatesForm } from "./updates-form/UpdatesForm";
import { MenuFormItem } from "_views/menu-form-item/MenuFormItem";

export const DqmInputOptions = () => {
  const code = useDqmStore();

  return (
    <div className={style.container}>
      <div className={style.arrangement}>
        <Form>
          <ArrangementForm />
          <UpdatesForm />
        </Form>
      </div>

      <div>
        {code.inputs.map((t, i) => (
          <DqmInputCard key={t.theater} index={i} />
        ))}
      </div>
      <Button style={{ width: "100%" }} onClick={() => code.pushNewTheater()}>
        Add New Theater
      </Button>
    </div>
  );
};

const ArrangementForm = () => {
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
