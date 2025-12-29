import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { PropertyTableRows } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuParamPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const GraphMenuCpsParamCountsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const paramRows: PropertyTableRows = [
    ["Ast Value Count", tryCatchLeap(p.getAstValues(), (o) => o.length)],
    // [
    //   "Default Value Count",
    //   tryCatchLeap(p.getDefaultValues(), (o) => o.length),
    // ],
    // ["User Value Count", tryCatchLeap(p.getAstValues(), (o) => o.length)],
  ];

  return (
    <>
      <SectionTitle parts={["code:ICpsParam", "Props"]} />
      <PropertyTable rows={paramRows} />
    </>
  );
};
