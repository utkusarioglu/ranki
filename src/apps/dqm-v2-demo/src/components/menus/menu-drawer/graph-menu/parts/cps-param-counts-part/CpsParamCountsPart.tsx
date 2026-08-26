import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import type { FC } from "react";

import { tryCatchLeap } from "@dqm/package-dqm-v2-debug";

import type { PropertyTableRows } from "../../tables/PropertyTable";

import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";

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
