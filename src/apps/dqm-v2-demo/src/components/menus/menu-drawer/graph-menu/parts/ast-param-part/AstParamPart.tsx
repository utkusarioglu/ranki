import type { IAstParamNode } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { PropertyTableRows } from "../../tables/PropertyTable";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch, tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuParamPartProps {
  param: ClassSanitizer<IAstParamNode>;
}

export const GraphMenuAstParamPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const paramRows: PropertyTableRows = [
    ["Source Value Count", tryCatchLeap(p.getValues(), (o) => o.length)],
  ];

  const valuesPre = p.getValues();
  if (valuesPre.state === "fail") {
    return <div>failed</div>;
  }
  const values = valuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return (
    <>
      <SectionTitle>Param Props</SectionTitle>
      <PropertyTable rows={paramRows} />
      <SectionTitle>Source Values</SectionTitle>
      <ParameterTable rows={values} />
    </>
  );
};
