import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import type { FC } from "react";

import { tryCatchLeap } from "@dqm/package-dqm-v2-debug";

import type { PropertyTableRows } from "../../tables/PropertyTable";

import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";

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
