import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch } from "_utils/utils.mjs";

interface GraphMenuParamPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const GraphMenuCpsMergedParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const valuesPre = p.getMergedValues();
  if (valuesPre.state === "fail") {
    return <div>Merged values failed</div>;
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
