import type { FC } from "react";

import { useDqmStore } from "_stores/dqm/dqm.store.mts";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";

import type { MenuDrawerSwitchProps } from "../../MenuDrawerSwitch";

import {
  useArrangementTemplateFetch,
  useSingleTemplateFetch,
} from "../hooks.mts";
import { ArrangementTemplateGroup } from "./ArrangementTemplateGroup";

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
          active={dqm.inputs[mode.index].dqm}
          group={g}
          index={mode.index}
          key={g.label}
          previewOnClick={(inputs) => {
            dqm.setAllInputs(inputs);
          }}
          singles={dqm.singleTemplates}
          useOnClick={(inputs) => {
            ui.setTemplateDrawerState(null);
            ui.isNarrow && ui.setMenuOpen(false);
            dqm.setAllInputs(inputs);
          }}
        />
      ))}
    </>
  );
};
