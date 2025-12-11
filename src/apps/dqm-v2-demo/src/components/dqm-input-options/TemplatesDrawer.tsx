import { Button, Drawer, Typography } from "antd";
import { useUiStore } from "../../stores/ui/ui.store.mts";
import { type TemplateDrawerModeOpen } from "../../stores/ui/ui.store.types.mts";
import style from "./TemplatesDrawer.module.css";
import { useCodeStore } from "../../stores/dqm/dqm.store.mts";
import { type FC } from "react";
import { Scroller } from "../scroller/Scroller";
import { TemplateGroup } from "./TemplateGroup";
import { CloseOutlined } from "@ant-design/icons";
import { TitleRow } from "../title-row/TitleRow";

export const TemplatesDrawer = () => {
  const ui = useUiStore();

  return (
    <Drawer
      className={style.container}
      // title={
      //   <Typography.Title className={style.title} level={3}>
      //     Load Template
      //   </Typography.Title>
      // }
      placement="left"
      closable={false}
      size={ui.menuWidth}
      mask={false}
      // maskClosable
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
  const ui = useUiStore();
  const code = useCodeStore();

  switch (mode.type) {
    case "arrangement":
      return (
        <Scroller direction="vertical">
          {Array.from(code.arrangements.values()).map((g) => (
            <div key={g.label}>{g.label}</div>
            //   <TemplateGroup
            //     key={g.label}
            //     group={g}
            //     index={mode.index}
            //     active={code.inputs[mode.index].dqm}
            //     useOnClick={(raw: string) => {
            //       ui.setTemplateDrawerState(null);
            //       ui.isNarrow && ui.setMenuOpen(false);
            //       code.setTheaterDqmByIndex(mode.index, raw);
            //     }}
            //     previewOnClick={(raw: string) =>
            //       code.setTheaterDqmByIndex(mode.index, raw)
            //     }
            //   />
          ))}
        </Scroller>
      );
    case "single":
      return (
        <Scroller direction="vertical">
          <TitleRow>
            <Typography.Title className={style.title} level={3}>
              Load Template
            </Typography.Title>
            <Button
              variant="link"
              onClick={() => {
                // code.setArrangementFromHistory(0);
                ui.setTemplateDrawerState(null);
              }}
            >
              <CloseOutlined />
            </Button>
          </TitleRow>
          {Array.from(code.templates.values()).map((g) => (
            <TemplateGroup
              key={g.label}
              group={g}
              index={mode.index}
              active={code.inputs[mode.index].dqm}
              useOnClick={(raw: string) => {
                ui.setTemplateDrawerState(null);
                ui.isNarrow && ui.setMenuOpen(false);
                code.setTheaterDqmByIndex(mode.index, raw);
              }}
              previewOnClick={(raw: string) => {
                // code.pushArrangementToHistory();
                code.setTheaterDqmByIndex(mode.index, raw);
              }}
            />
          ))}
        </Scroller>
      );
  }
};

export interface WithIndex {
  useOnClick: (raw: string) => void;
  previewOnClick: (raw: string) => void;
  index: number;
  active: string;
}
