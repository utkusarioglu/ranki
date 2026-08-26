import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { ReorderList } from "_views/reorder-list/ReorderList";
import { Button, Form } from "antd";
import { useMemo } from "react";

import { ArrangementForm } from "./arrangement-form/ArrangementForm";
import { dqmInputCardBuilder } from "./dqm-input-card/DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { UpdatesForm } from "./updates-form/UpdatesForm";

export const DqmInputOptions = () => {
  const code = useDqmStore();
  const ui = useUiStore();

  const component = useMemo(
    () =>
      dqmInputCardBuilder({
        removeTheaterByIndex: code.removeTheaterByIndex,
        setTemplateDrawerState: ui.setTemplateDrawerState,
        setTheaterDqmByIndex: code.setTheaterDqmByIndex,
        setTheaterNameByIndex: code.setTheaterNameByIndex,
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
          component={component}
          enableDrag
          id="inputs"
          list={code.inputs}
          onChange={code.setAllInputs}
        />
      </div>

      <div className={style.band}>
        <Button onClick={() => code.pushNewTheater()} style={{ width: "100%" }}>
          Add New Theater
        </Button>
        <ArrangementForm />
      </div>
    </>
  );
};
