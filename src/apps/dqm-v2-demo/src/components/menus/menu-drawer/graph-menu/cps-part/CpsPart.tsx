import { type FC } from "react";
import { type PropertyTableRows } from "../tables/PropertyTable";
import { SectionTitle } from "../section-title/SectionTitle";
import { PropertyTable } from "../tables/PropertyTable";
import type { ICps } from "@dqm/package-dqm-api-v2";

interface GraphMenuCpsPartProps {
  cps: ICps;
}

export const GraphMenuCpsPart: FC<GraphMenuCpsPartProps> = ({ cps: a }) => {
  const astRows: PropertyTableRows = [
    ["Id", () => a.getId().getId().join(".")],
    ["Child Count", () => a.getChildren().length],
    ["On Fail Mode", () => (a.getOnFailMode() ? "true" : "false")],
  ];

  return (
    <>
      <SectionTitle>Cps Props</SectionTitle>
      <PropertyTable rows={astRows} />
    </>
  );
};
