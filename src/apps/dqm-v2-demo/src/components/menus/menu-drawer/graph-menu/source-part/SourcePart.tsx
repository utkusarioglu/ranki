import type { IAstNode, IParam } from "@dqm/package-dqm-api-v2";
import { PreCode } from "_views/pre-code/PreCode";
import type { FC } from "react";
import { PropertyTable } from "../tables/PropertyTable";
import { SectionTitle } from "../section-title/SectionTitle";
import { tryCatch } from "../utils";
import { type PropertyTableRows } from "../tables/PropertyTable";

interface GraphMenuSourcePartProps {
  node: IAstNode | IParam;
}
export const GraphMenuSourcePart: FC<GraphMenuSourcePartProps> = ({ node }) => {
  const sourceString = tryCatch(() => node.getSourceString());

  const rows: PropertyTableRows = [["Length", () => sourceString.length]];

  return (
    <>
      <SectionTitle>Source</SectionTitle>
      <PreCode>{sourceString}</PreCode>
      <PropertyTable rows={rows} />
    </>
  );
};
