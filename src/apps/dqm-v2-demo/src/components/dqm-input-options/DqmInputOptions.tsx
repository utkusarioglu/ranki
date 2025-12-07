import { useCodeStore } from "../../stores/code/code.store.mts";
import { Button, Flex } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { SaveOutlined } from "@ant-design/icons";
import { TemplatesDrawer } from "./TemplatesDrawer";
import { useUiStore } from "../../stores/ui/ui.store.mts";

export const DqmInputOptions = () => {
  const code = useCodeStore();
  const ui = useUiStore();

  return (
    <div className={style.container}>
      <Flex className={style.arrangement}>
        <Button
          onClick={() =>
            ui.setTemplateDrawerState({
              type: "arrangement",
              index: 0,
            })
          }
        >
          Load Arrangement
        </Button>
        <Button>
          <SaveOutlined />
        </Button>
      </Flex>
      <div>
        {code.inputs.map((t, i) => (
          <DqmInputCard key={t.theater} index={i} />
        ))}
      </div>
      <Button style={{ width: "100%" }} onClick={() => code.pushNewTheater()}>
        Add New Theater
      </Button>
      <TemplatesDrawer />
    </div>
  );
};
