import { type FC } from "react";
import { type PropertyTableRows } from "../../tables/PropertyTable";
import type { ICpx } from "@dqm/package-dqm-api-v2";
import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuAstPartProps {
  cpx: ClassSanitizer<ICpx>;
}

export const GraphMenuCpxPart: FC<GraphMenuAstPartProps> = ({ cpx: a }) => {
  const astRows: PropertyTableRows = [
    ["Unique Id", a.getUnique()],
    ["Chain List", a.getChainListString()],
    ["Id List", a.getIdListString()],
    ["AstParam Count", tryCatchLeap(a.getAstParams(), (o) => o.length)],
    ["Children Count", tryCatchLeap(a.getCpxEdges(), (o) => o.length)],
    ["Cps Count", tryCatchLeap(a.getCpsList(), (o) => o.length)],
    ["Root Cps Id", tryCatchLeap(a.getRootCps(), (o) => o.getIdString())],
    ["Leaf Cps Id", tryCatchLeap(a.getLeafCps(), (o) => o.getIdString())],
    ["Root Ast Creator", tryCatchLeap(a.getRootAst(), (o) => o.getCreator())],
  ];

  return (
    <>
      <SectionTitle parts={["code:ICpx", "Props"]} />
      <PropertyTable rows={astRows} />
    </>
  );
};
