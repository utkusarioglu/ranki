import { CloseOutlined, EyeFilled, SaveOutlined } from "@ant-design/icons";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { Button, Flex, Input } from "antd";
import { type FC } from "react";
import style from "./DqmInputCard.module.css";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";

interface DqmInputProps {
  index: number;
}

export const DqmInputCard: FC<DqmInputProps> = ({ index }) => {
  const { dqm, theater } = useDqmStore((s) => s.inputs[index]);
  const code = useDqmStore();
  const ui = useUiStore();

  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input
          value={theater}
          onChange={(e) => code.setTheaterNameByIndex(index, e.target.value)}
        />
        <Flex>
          <Button icon={<EyeFilled />} />
          <Button
            icon={<CloseOutlined />}
            onClick={() => code.removeTheaterByIndex(index)}
          />
        </Flex>
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
    </SkinnyCard>
  );
};
