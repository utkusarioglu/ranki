import type { IAstNode, IParam } from "@dqm/package-dqm-api-v2";
import { PreCode } from "_views/pre-code/PreCode";
import type { FC } from "react";
import { ParamTable } from "../param-table/ParamTable";
import { SectionTitle } from "../section-title/SectionTitle";
import { tryCatch, type Rows } from "../utils";

interface GraphMenuSourcePartProps {
  node: IAstNode | IParam;
}
export const GraphMenuSourcePart: FC<GraphMenuSourcePartProps> = ({ node }) => {
  const sourceString = tryCatch(() => node.getSourceString());

  const rows: Rows = [["Length", () => sourceString.length]];

  return (
    <>
      <SectionTitle>Source</SectionTitle>
      <PreCode>{sourceString}</PreCode>
      <ParamTable rows={rows} />
    </>
  );
};
