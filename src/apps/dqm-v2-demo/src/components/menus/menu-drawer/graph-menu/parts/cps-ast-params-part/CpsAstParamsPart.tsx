import type { FC } from "react";
import {
  SectionTitle,
  SectionTitleCode,
} from "../../section-title/SectionTitle";
import { AstParamTable, type AstParamTableProps } from "./AstParamTable";

type GraphMenuParamPartProps = AstParamTableProps;

export const GraphMenuCpsAstParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  return (
    <>
      <SectionTitle>
        <SectionTitleCode>AstParam</SectionTitleCode> Values
      </SectionTitle>
      <AstParamTable param={p} />
    </>
  );
};
