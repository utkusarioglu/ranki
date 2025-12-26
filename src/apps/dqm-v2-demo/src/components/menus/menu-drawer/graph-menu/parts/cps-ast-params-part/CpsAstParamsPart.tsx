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

export const GraphMenuCpsAstParamsPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const astValuesPre = p.getAstValues();
  if (astValuesPre.state === "fail") {
    return <div>ast values failed</div>;
  }
  const astValues = astValuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return (
    <>
      <SectionTitle>Ast Values</SectionTitle>
      <ParameterTable rows={astValues} />
    </>
  );
};
