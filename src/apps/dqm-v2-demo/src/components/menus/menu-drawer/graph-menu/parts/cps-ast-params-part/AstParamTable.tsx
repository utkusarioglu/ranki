import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
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
          No
          <Typography.Text code>AstParam</Typography.Text>
          links to this <Typography.Text code>CpsParam</Typography.Text>
        </Typography>
      </div>
    );
  }
  const astValues = astValuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return <ParameterTable rows={astValues} />;
};
