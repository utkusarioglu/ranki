import { useCodeStore } from "../../stores/code/code.store.mts";
import style from "./DqmInputCard.module.css";
import { useState, type FC } from "react";
import { Button, Card, Flex, Input, Space } from "antd";
import {
  CloseOutlined,
  DownOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  SaveFilled,
  SaveOutlined,
  UpOutlined,
} from "@ant-design/icons";

interface DqmInputProps {
  index: number;
}
export const DqmInputCard: FC<DqmInputProps> = ({ index }) => {
  const { dqm, theater } = useCodeStore((s) => s.inputs[index]);
  const code = useCodeStore();
  const [tMenu, setTMenu] = useState(false);

  return (
    <div className={style.container}>
      <Flex>
        <Input
          value={theater}
          onChange={(e) => code.setTheaterNameByIndex(index, e.target.value)}
        />
        <Button
          icon={tMenu ? <EyeFilled /> : <EyeInvisibleFilled />}
          // onClick={() => setTMenu((t) => !t)}
        />
        <Button
          icon={<CloseOutlined />}
          onClick={() => code.removeTheaterByIndex(index)}
        />
      </Flex>
      {tMenu &&
        code.textTemplates.map(({ icon, title, raw, description }) => (
          <Card
            className={style.templateItem}
            key={title}
            onClick={() => code.setTheaterDqmByIndex(index, raw)}
          >
            {title}
          </Card>
        ))}
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
        <Button onClick={() => setTMenu((v) => !v)}>Templates</Button>
      </Flex>
    </div>
  );
};
