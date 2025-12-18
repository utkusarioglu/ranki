import {
  CloseOutlined,
  DragOutlined,
  EyeFilled,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input } from "antd";
import style from "./DqmInputCard.module.css";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import type {
  CpxParseInput,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";
import type { UiStoreActions } from "_stores/ui/ui.store.types.mjs";
import type { DqmStoreActions } from "_stores/dqm/dqm.store.types.mjs";
import type { FC, Ref } from "react";

type DqmInputCardBuilderFuncProps = Pick<
  UiStoreActions,
  "setTemplateDrawerState"
> &
  Pick<
    DqmStoreActions,
    "setTheaterDqmByIndex" | "setTheaterNameByIndex" | "removeTheaterByIndex"
  >;

interface DqmInputPropsItem {
  item: CpxParseInput;
  index: number;
  list: DqmParseInputStructured;
  ref: Ref<HTMLDivElement>;
}

type DqmInputCardBuilderFunc = (
  p: DqmInputCardBuilderFuncProps,
) => AstPropRowComponent;

export type AstPropRowComponent = FC<DqmInputPropsItem>;

export const DqmInputCardBuilder: DqmInputCardBuilderFunc =
  (s) =>
  ({ index, item: { theater, dqm }, ref }) => {
    return (
      <SkinnyCard className={style.card} ref={ref}>
        <Flex className={style.row}>
          <Input
            value={theater}
            onChange={(e) => s.setTheaterNameByIndex(index, e.target.value)}
          />
          <Flex>
            <Button icon={<EyeFilled />} />
            <Button
              icon={<CloseOutlined />}
              onClick={() => s.removeTheaterByIndex(index)}
            />
          </Flex>
        </Flex>
        <Input.TextArea
          className={style.textarea}
          autoSize
          onChange={(e) => s.setTheaterDqmByIndex(index, e.target.value)}
          value={dqm}
        />
        <Flex className={style.bottom} justify="space-between">
          <DragOutlined />
          <Flex className={style.actions}>
            <Button>
              <SaveOutlined />
            </Button>
            <Button
              onClick={() =>
                s.setTemplateDrawerState({
                  type: "single",
                  index,
                })
              }
            >
              Templates
            </Button>
          </Flex>
        </Flex>
      </SkinnyCard>
    );
  };
