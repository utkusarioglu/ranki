import { type FC } from "react";
import { type PropertyTableRows } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import { tryCatchLeap } from "@dqm/package-dqm-v2-debug";

interface GraphMenuCpsPartProps {
  cps: ClassSanitizer<ICps>;
}

export const GraphMenuCpsPart: FC<GraphMenuCpsPartProps> = ({ cps: a }) => {
  const astRows: PropertyTableRows = [
    ["Id", a.getIdString()],
    ["Child Count", tryCatchLeap(a.getCpsEdges(), (o) => o.length)],
    [
      "On Fail Mode",
      tryCatchLeap(a.isOnFailMode(), (o) => (o ? "true" : "false")),
    ],
  ];

  return (
    <>
      <SectionTitle parts={["code:Cps", "Props"]} />
      <PropertyTable rows={astRows} />
    </>
  );
};
