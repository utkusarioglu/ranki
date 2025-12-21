import type { FC } from "react";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { SingleTemplateGroup } from "./SingleTemplateGroup";
import { useSingleTemplateFetch } from "../hooks.mts";
import type { MenuDrawerSwitchProps } from "../../MenuDrawerSwitch";

type SingleTemplatesProps = MenuDrawerSwitchProps;

export const SingleTemplates: FC<SingleTemplatesProps> = ({ mode }) => {
  useSingleTemplateFetch();
  const dqm = useDqmStore();
  const ui = useUiStore();

  if (mode.type !== "single") {
    return <div>You shouldn't be able to reach here</div>;
  }

  return (
    <>
      <DrawerTitleRow>Load Template</DrawerTitleRow>
      {Array.from(dqm.singleTemplates.values()).map((g) => (
        <SingleTemplateGroup
          key={g.label}
          group={g}
          index={mode.index}
          active={dqm.inputs[mode.index].dqm}
          useOnClick={(raw: string) => {
            ui.setTemplateDrawerState(null);
            ui.isNarrow && ui.setMenuOpen(false);
            dqm.setTheaterDqmByIndex(mode.index, raw);
          }}
          previewOnClick={(raw: string) => {
            dqm.setTheaterDqmByIndex(mode.index, raw);
          }}
        />
      ))}
    </>
  );
};
