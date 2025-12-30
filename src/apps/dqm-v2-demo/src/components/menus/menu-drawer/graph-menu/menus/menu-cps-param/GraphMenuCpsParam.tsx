import { type FC } from "react";
import { DrawerTitleRow } from "_views/drawer-title-row/DrawerTitleRow";
import type { GraphDrawerCpsParam } from "_stores/ui/ui.store.types.mjs";
import { GraphMenuCpsParamSemanticPart } from "../../parts/cps-param-semantic-part/CpsParamSemanticPart";
import { GraphMenuCpsParamCountsPart } from "../../parts/cps-param-counts-part/CpsParamCountsPart";
import { GraphMenuCpsAstParamsPart } from "../../parts/cps-ast-params-part/CpsAstParamsPart";
import { GraphMenuAstParamSemanticPart } from "../../parts/ast-param-semantic-part/AstParamSemanticPart";
import type { IAstParamNode } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { CpsParamMutationEntriesPart } from "../../parts/cps-param-mutation-entries-part/CpsParamMutationEntriesPart";

interface GraphMenuCpsParamProps {
  data: GraphDrawerCpsParam;
}

export const GraphMenuCpsParam: FC<GraphMenuCpsParamProps> = ({ data }) => {
  const d = data.sanitizedDqmNode;

  return (
    <>
      <DrawerTitleRow>CpsParam Node</DrawerTitleRow>
      <GraphMenuCpsParamSemanticPart param={d} />
      <GraphMenuAstParamSemanticPart
        param={d as unknown as ClassSanitizer<IAstParamNode>}
      />
      <GraphMenuCpsParamCountsPart param={d} />
      <GraphMenuCpsAstParamsPart param={d} />
      <CpsParamMutationEntriesPart param={d} />
    </>
  );
};
