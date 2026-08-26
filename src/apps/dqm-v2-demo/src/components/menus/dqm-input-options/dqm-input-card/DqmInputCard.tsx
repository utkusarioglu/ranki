import type { DqmStoreActions } from "_stores/dqm/dqm.store.types.mjs";
import type { UiStoreActions } from "_stores/ui/ui.store.types.mjs";
import type {
  CpxParseInput,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";
import type { FC, Ref } from "react";

import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import {
  CloseOutlined,
  DragOutlined,
  EyeFilled,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input } from "antd";

import style from "./DqmInputCard.module.css";

type AstPropRowComponent = FC<DqmInputPropsItem>;

type DqmInputCardBuilderFunc = (
  p: DqmInputCardBuilderFuncProps,
) => AstPropRowComponent;

type DqmInputCardBuilderFuncProps = Pick<
    DqmStoreActions,
    "removeTheaterByIndex" | "setTheaterDqmByIndex" | "setTheaterNameByIndex"
  > &
  Pick<
  UiStoreActions,
  "setTemplateDrawerState"
>;

interface DqmInputPropsItem {
  index: number;
  item: CpxParseInput;
  list: DqmParseInputStructured;
  ref: Ref<HTMLDivElement>;
}

export const dqmInputCardBuilder: DqmInputCardBuilderFunc =
  (s) =>
  ({ index, item: { dqm, theater }, ref }) => {
    return (
      <SkinnyCard className={style.card} ref={ref}>
        <Flex className={style.row}>
          <Input
            onChange={(e) => s.setTheaterNameByIndex(index, e.target.value)}
            value={theater}
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
          autoSize
          className={style.textarea}
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
                  index,
                  type: "single",
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
