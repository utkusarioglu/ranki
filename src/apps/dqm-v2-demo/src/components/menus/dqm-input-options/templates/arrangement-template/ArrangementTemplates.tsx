import {
  useArrangementTemplateFetch,
  useSingleTemplateFetch,
} from "../hooks.mts";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import { ArrangementTemplateGroup } from "./ArrangementTemplateGroup";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import type { FC } from "react";
import type { MenuDrawerSwitchProps } from "../../MenuDrawerSwitch";

type ArrangementTemplatesProps = MenuDrawerSwitchProps;

export const ArrangementTemplates: FC<ArrangementTemplatesProps> = ({
  mode,
}) => {
  useSingleTemplateFetch();
  useArrangementTemplateFetch();
  const dqm = useDqmStore();
  const ui = useUiStore();

  if (mode.type !== "arrangement") {
    return <div>You shouldn't be able to reach here</div>;
  }

  return (
    <>
      <DrawerTitleRow>Load Arrangement</DrawerTitleRow>

      {Array.from(dqm.arrangementTemplates.values()).map((g) => (
        <ArrangementTemplateGroup
          singles={dqm.singleTemplates}
          key={g.label}
          group={g}
          index={mode.index}
          active={dqm.inputs[mode.index].dqm}
          useOnClick={(inputs) => {
            ui.setTemplateDrawerState(null);
            ui.isNarrow && ui.setMenuOpen(false);
            dqm.setAllInputs(inputs);
          }}
          previewOnClick={(inputs) => {
            dqm.setAllInputs(inputs);
          }}
        />
      ))}
    </>
  );
};
