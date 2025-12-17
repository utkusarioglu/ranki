import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { Button, Form } from "antd";
import { DqmInputCard } from "./dqm-input-card/DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { UpdatesForm } from "./updates-form/UpdatesForm";
import { ArrangementForm } from "./arrangement-form/ArrangementForm";

export const DqmInputOptions = () => {
  const code = useDqmStore();

  return (
    <>
      <Form className={style.band}>
        <UpdatesForm />
      </Form>

      <div className={style.container}>
        <div>
          {
            // TODO the children shouldn't need to know their index. custom
            // callbacks can fix this.
            code.inputs.map((_t, i) => (
              <DqmInputCard key={i} index={i} />
            ))
          }
        </div>
      </div>

      <div className={style.band}>
        <Button style={{ width: "100%" }} onClick={() => code.pushNewTheater()}>
          Add New Theater
        </Button>
        <ArrangementForm />
      </div>
    </>
  );
};
