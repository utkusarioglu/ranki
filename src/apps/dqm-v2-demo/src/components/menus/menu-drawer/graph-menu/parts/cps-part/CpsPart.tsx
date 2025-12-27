import { type FC } from "react";
import { type PropertyTableRows } from "../../tables/PropertyTable";
import {
  SectionTitle,
  SectionTitleCode,
} from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuCpsPartProps {
  cps: ClassSanitizer<ICps>;
}

export const GraphMenuCpsPart: FC<GraphMenuCpsPartProps> = ({ cps: a }) => {
  const astRows: PropertyTableRows = [
    ["Id", a.getIdString()],
    ["Child Count", tryCatchLeap(a.getChildren(), (o) => o.length)],
    [
      "On Fail Mode",
      tryCatchLeap(a.getOnFailMode(), (o) => (o.value ? "true" : "false")),
    ],
  ];

  return (
    <>
      <SectionTitle>
        <SectionTitleCode>Cps</SectionTitleCode> Props
      </SectionTitle>
      <PropertyTable rows={astRows} />
    </>
  );
};
