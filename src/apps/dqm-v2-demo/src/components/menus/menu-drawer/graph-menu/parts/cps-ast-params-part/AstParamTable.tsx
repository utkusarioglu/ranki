import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC, PropsWithChildren } from "react";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch } from "_utils/utils.mjs";
import { Typography } from "antd";
import style from "./AstParamTable.module.css";

export type AstParamTableProps = {
  param: ClassSanitizer<ICpsParam>;
};

export const AstParamTable: FC<AstParamTableProps> = ({ param: p }) => {
  const astValuesPre = p.getAstValues();
  if (astValuesPre.state === "fail") {
    return (
      <div className={style.container}>
        <Typography>
          Retrieval of
          <Typography.Text code>AstParam</Typography.Text>
          values failed unexpectedly
        </Typography>
      </div>
    );
  }
  // const astValues = astValuesPre.value;
  if (!astValuesPre.value) {
    return (
      <ExceptionContainer>
        <Typography>
          No
          <Typography.Text code>AstParam</Typography.Text>
          links to this <Typography.Text code>CpsParam</Typography.Text>
        </Typography>
      </ExceptionContainer>
    );
  }
  const astValues = astValuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return <ParameterTable rows={astValues} />;
};

const ExceptionContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className={style.container}>{children}</div>;
};
