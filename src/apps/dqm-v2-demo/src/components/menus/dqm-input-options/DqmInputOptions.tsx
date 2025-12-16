import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { Button, Form } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { UpdatesForm } from "./updates-form/UpdatesForm";
import { ArrangementForm } from "./arrangement-form/ArrangementForm";

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
