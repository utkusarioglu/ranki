import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch } from "_utils/utils.mjs";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { Typography } from "antd";

interface GraphMenuParamPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const GraphMenuCpsMergedParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const valuesPre = p.getMergedValues();
  if (valuesPre.state === "fail") {
    return (
      <ExceptionCard>
        <Typography.Text code>ICpsParam</Typography.Text> merged values
        retrieval failed
      </ExceptionCard>
    );
  }
  const values = valuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return (
    <>
      <SectionTitle>Merged Values</SectionTitle>
      <ParameterTable rows={values} />
    </>
  );
};
