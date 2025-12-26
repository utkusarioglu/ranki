import type { IAstParamNode, ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { PropertyTableRows } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";

interface GraphMenuParamSemanticPartProps {
  param: ClassSanitizer<ICpsParam | IAstParamNode>;
}

export const GraphMenuParamSemanticPart: FC<
  GraphMenuParamSemanticPartProps
> = ({ param: p }) => {
  const paramRows: PropertyTableRows = [
    ["Audience", p.getAudience()],
    ["Operator", p.getOperator()],
    ["Channel", p.getChannel()],
    ["Alias", p.getAlias()],
    ["Chain", p.getChainString()],
    ["Producer", p.getProducer()],
  ];

  return (
    <>
      <SectionTitle>Semantic Props</SectionTitle>
      <PropertyTable rows={paramRows} />
    </>
  );
};
