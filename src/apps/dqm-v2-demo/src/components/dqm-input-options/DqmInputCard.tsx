import { useCodeStore } from "../../stores/code/code.store.mts";
import style from "./DqmInputCard.module.css";
import { type FC } from "react";
import { Button, Flex, Input } from "antd";
import { CloseOutlined, EyeFilled, SaveOutlined } from "@ant-design/icons";
import { useUiStore } from "../../stores/ui/ui.store.mts";

interface DqmInputProps {
  index: number;
}
export const DqmInputCard: FC<DqmInputProps> = ({ index }) => {
  const { dqm, theater } = useCodeStore((s) => s.inputs[index]);
  const code = useCodeStore();
  const ui = useUiStore();

  return (
    <div className={style.container}>
      <Flex>
        <Input
          value={theater}
          onChange={(e) => code.setTheaterNameByIndex(index, e.target.value)}
        />
        <Button icon={<EyeFilled />} />
        <Button
          icon={<CloseOutlined />}
          onClick={() => code.removeTheaterByIndex(index)}
        />
      </Flex>
      <Input.TextArea
        className={style.textarea}
        autoSize
        onChange={(e) => code.setTheaterDqmByIndex(index, e.target.value)}
        value={dqm}
      />
      <Flex>
        <Button>
          <SaveOutlined />
        </Button>
        {/* <TemplateMenu index={index} /> */}
        <Button
          onClick={() =>
            ui.setTemplateDrawerState({
              type: "single",
              index,
            })
          }
        >
          Templates
        </Button>
      </Flex>
    </div>
  );
};
