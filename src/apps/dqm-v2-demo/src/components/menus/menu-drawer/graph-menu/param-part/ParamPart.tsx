import type { IParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { ParamTable } from "../param-table/ParamTable";
import { SectionTitle } from "../section-title/SectionTitle";
import type { Rows } from "../utils";

interface GraphMenuParamPartProps {
  param: IParam;
}

export const GraphMenuParamPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const paramRows: Rows = [
    ["Creator", () => p.getCreator()],
    ["Audience", () => p.getAudience()],
    ["Operator", () => p.getOperator()],
    ["Alias", () => p.getId().getAlias()],
    ["Chain", () => p.getId().getChain()],
    ["Producer", () => p.getProducer()],
    ["Value Count", () => p.getValues().length],
  ];

  return (
    <>
      <SectionTitle>Param Props</SectionTitle>
      <ParamTable rows={paramRows} />
    </>
  );
};
