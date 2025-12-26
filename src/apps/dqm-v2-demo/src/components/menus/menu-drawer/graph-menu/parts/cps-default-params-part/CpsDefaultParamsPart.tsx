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

export const GraphMenuCpsDefaultParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const defaultValuesPre = p.getDefaultValues();
  if (defaultValuesPre.state === "fail") {
    return <div>default values failed</div>;
  }
  const defaultValues = defaultValuesPre.value.map<ParameterTableValueTuple>(
    (v) => [v.type, tryCatch(v.type, () => v.defaultValue)],
  );

  return (
    <>
      <SectionTitle>Default Values</SectionTitle>
      <ParameterTable rows={defaultValues} />
    </>
  );
};
