import type { FC } from "react";

import { SectionTitle } from "../../section-title/SectionTitle";
import { AstParamTable, type AstParamTableProps } from "./AstParamTable";

type GraphMenuParamPartProps = AstParamTableProps;

export const GraphMenuCpsAstParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  return (
    <>
      <SectionTitle parts={["code:AstParam", "Values"]} />
      <AstParamTable param={p} />
    </>
  );
};
