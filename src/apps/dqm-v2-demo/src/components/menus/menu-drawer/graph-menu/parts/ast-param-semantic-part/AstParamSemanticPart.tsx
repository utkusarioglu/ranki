import type { IAstParamNode } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { PropertyTableRows } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";

interface GraphMenuAstParamSemanticPartProps {
  param: ClassSanitizer<IAstParamNode>;
}

export const GraphMenuAstParamSemanticPart: FC<
  GraphMenuAstParamSemanticPartProps
> = ({ param: p }) => {
  const paramRows: PropertyTableRows = [
    ["Audience", p.getAudience()],
    ["Operator", p.getOperator()],
    ["Channel", p.getChannel()],
    ["AliasString", p.getAlias()],
    ["ChainString", p.getChainString()],
  ];

  return (
    <>
      <SectionTitle parts={["code:IAstParamNode", "Semantic Props"]} />
      <PropertyTable rows={paramRows} />
    </>
  );
};
