import { type FC } from "react";
import { type Rows } from "../utils";
import { SectionTitle } from "../section-title/SectionTitle";
import { ParamTable } from "../param-table/ParamTable";
import type { ICps } from "@dqm/package-dqm-api-v2";

interface GraphMenuCpsPartProps {
  cps: ICps;
}

export const GraphMenuCpsPart: FC<GraphMenuCpsPartProps> = ({ cps: a }) => {
  const astRows: Rows = [
    ["Id", () => a.getId().getId().join(".")],
    ["Child Count", () => a.getChildren().length],
    ["On Fail Mode", () => (a.getOnFailMode() ? "true" : "false")],
  ];

  return (
    <>
      <SectionTitle>Cps Props</SectionTitle>
      <ParamTable rows={astRows} />
    </>
  );
};
