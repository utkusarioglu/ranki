import { Drawer, Typography } from "antd";
import {
  useUiStore,
  type TemplateDrawerModeOpen,
} from "../../stores/ui/ui.store.mts";
import style from "./TemplatesDrawer.module.css";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { type FC } from "react";
import { Scroller } from "../scroller/Scroller";
import { TemplateGroup } from "./TemplateGroup";

export const TemplatesDrawer = () => {
  const ui = useUiStore();

  return (
    <Drawer
      className={style.container}
      title={
        <Typography.Title className={style.title} level={3}>
          Load Template
        </Typography.Title>
      }
      placement="left"
      closable={true}
      size={ui.menuWidth}
      mask={false}
      maskClosable
      styles={{
        wrapper: {
          boxShadow: "none",
        },
      }}
      onClose={() => ui.setTemplateDrawerState(null)}
      open={ui.templateDrawerState !== null}
    >
      {ui.templateDrawerState === null ? null : (
        <TemplateGroups mode={ui.templateDrawerState} />
      )}
    </Drawer>
  );
};

type TemplateGroupsProps = {
  mode: TemplateDrawerModeOpen;
};

const TemplateGroups: FC<TemplateGroupsProps> = ({ mode }) => {
  const code = useCodeStore();

  return (
    <Scroller direction="vertical">
      {code.templateLists.map((g) => (
        <TemplateGroup
          key={g.label}
          group={g}
          index={mode.index}
          active={code.inputs[mode.index].dqm}
          onClick={(raw: string) => code.setTheaterDqmByIndex(mode.index, raw)}
        />
      ))}
    </Scroller>
  );
};

export interface WithIndex {
  onClick: (raw: string) => void;
  index: number;
  active: string;
}
