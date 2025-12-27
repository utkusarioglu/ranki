import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch } from "_utils/utils.mjs";
import { Typography } from "antd";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";

export type AstParamTableProps = {
  param: ClassSanitizer<ICpsParam>;
};

export const AstParamTable: FC<AstParamTableProps> = ({ param: p }) => {
  const astValuesPre = p.getAstValues();
  if (astValuesPre.state === "fail") {
    return (
      <ExceptionCard>
        <Typography>
          Retrieval of
          <Typography.Text code>AstParam</Typography.Text>
          values failed unexpectedly
        </Typography>
      </ExceptionCard>
    );
  }
  if (!astValuesPre.value) {
    return (
      <ExceptionCard>
        <Typography>
          No
          <Typography.Text code>IAstParamNode</Typography.Text>
          links to this <Typography.Text code>ICpsParam</Typography.Text>
        </Typography>
      </ExceptionCard>
    );
  }
  const astValues = astValuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return <ParameterTable rows={astValues} />;
};
