import { useCodeStore } from "../../stores/code/code.store.mts";
import { Button, Flex } from "antd";
import { DqmInputCard } from "./DqmInputCard";
import style from "./DqmInputOptions.module.css";
import { SaveOutlined } from "@ant-design/icons";

export const DqmInputOptions = () => {
  const code = useCodeStore();

  return (
    <div className={style.container}>
      <Flex className={style.arrangement}>
        <Button>Load Arrangement</Button>
        <Button>
          <SaveOutlined />
        </Button>
      </Flex>
      <div>
        {code.inputs.map((t, i) => (
          <DqmInputCard key={t.theater} index={i} />
        ))}
      </div>
      <Button style={{ width: "100%" }} onClick={() => code.pushTheater()}>
        Add New Theater
      </Button>
    </div>
  );
};
