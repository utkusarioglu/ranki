import { type FC } from "react";
import { type Rows } from "../utils";
import type { ICpx } from "@dqm/package-dqm-api-v2";
import { SectionTitle } from "../section-title/SectionTitle";
import { ParamTable } from "../param-table/ParamTable";

interface GraphMenuAstPartProps {
  cpx: ICpx;
}

export const GraphMenuCpxPart: FC<GraphMenuAstPartProps> = ({ cpx: a }) => {
  const astRows: Rows = [
    ["Unique Id", () => a.getId().getUnique()],
    [
      "Chain List",
      () =>
        a
          .getChainList()
          .map((v) => v.join("."))
          .join("|"),
    ],
    [
      "Id List",
      () =>
        a
          .getIdList()
          .map((v) => v.join("."))
          .join("|"),
    ],
    ["Param Count", () => a.getParams()?.length],
    ["Children Count", () => a.getChildren().length],
    ["Cps Count", () => a.getCpsList().length],
    ["Root Cps Id", () => a.getRootCps().getId().getId().join(".")],
    ["Leaf Cps Id", () => a.getLeafCps().getId().getId().join(".")],
    ["Root Ast Creator", () => a.getRootAst().getCreator()],
  ];

  return (
    <>
      <SectionTitle>Cpx Props</SectionTitle>
      <ParamTable rows={astRows} />
    </>
  );
};
