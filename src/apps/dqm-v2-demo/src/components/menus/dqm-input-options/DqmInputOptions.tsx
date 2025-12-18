import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { Button, Form } from "antd";
import { dqmInputCardBuilder } from "./dqm-input-card/DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { UpdatesForm } from "./updates-form/UpdatesForm";
import { ArrangementForm } from "./arrangement-form/ArrangementForm";
import { ReorderList } from "_views/reorder-list/ReorderList";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { useMemo } from "react";

export const DqmInputOptions = () => {
  const code = useDqmStore();
  const ui = useUiStore();

  const component = useMemo(
    () =>
      dqmInputCardBuilder({
        setTheaterNameByIndex: code.setTheaterNameByIndex,
        setTheaterDqmByIndex: code.setTheaterDqmByIndex,
        setTemplateDrawerState: ui.setTemplateDrawerState,
        removeTheaterByIndex: code.removeTheaterByIndex,
      }),
    [],
  );

  return (
    <>
      <Form className={style.band}>
        <UpdatesForm />
      </Form>

      <div className={style.container}>
        <ReorderList
          list={code.inputs}
          onChange={code.setAllInputs}
          id="inputs"
          enableDrag
          component={component}
        />
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
