import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { PropertyTableRows } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuCpsParamSemanticPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const GraphMenuCpsParamSemanticPart: FC<
  GraphMenuCpsParamSemanticPartProps
> = ({ param: p }) => {
  const paramRows: PropertyTableRows = [
    ["Is Coupled", tryCatchLeap(p.isCoupled(), (o) => (o ? "true" : "false"))],
  ];

  return (
    <>
      <SectionTitle parts={["code:ICpsParam", "Semantic Props"]} />
      <PropertyTable rows={paramRows} />
    </>
  );
};
