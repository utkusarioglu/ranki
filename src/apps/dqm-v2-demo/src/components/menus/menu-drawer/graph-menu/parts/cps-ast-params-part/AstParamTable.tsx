import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import { tryCatch } from "@dqm/package-dqm-v2-debug";
import { Typography } from "antd";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";

export type AstParamTableProps = {
  param: ClassSanitizer<ICpsParam>;
};

export const AstParamTable: FC<AstParamTableProps> = ({ param: p }) => {
  const astCoupled = p.isCoupled();
  if (astCoupled.state === "fail") {
    return (
      <ExceptionCard>
        <Typography>
          Retrieval of
          <Typography.Text code>AstParam</Typography.Text>
          coupling state failed unexpectedly
        </Typography>
      </ExceptionCard>
    );
  }

  if (astCoupled.value === false) {
    return (
      <ExceptionCard>
        This <Typography.Text code>CpsParam</Typography.Text>
        is not coupled with any <Typography.Text code>AstParam</Typography.Text>
        .
      </ExceptionCard>
    );
  }

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
