import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { PropertyTable } from "../tables/PropertyTable";
import { SectionTitle } from "../section-title/SectionTitle";
import type { PropertyTableRows } from "../tables/PropertyTable";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch, tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuParamPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const GraphMenuCpsParamPart: FC<GraphMenuParamPartProps> = ({
  param: p,
}) => {
  const paramRows: PropertyTableRows = [
    // ["Audience", p.getAudience()],
    // ["Operator", p.getOperator()],
    // ["Alias", p.getAlias()],
    // ["Chain", p.getChainString()],
    // ["Producer", p.getProducer()],
    ["Ast Value Count", tryCatchLeap(p.getAstValues(), (o) => o.length)],
    [
      "Default Value Count",
      tryCatchLeap(p.getDefaultValues(), (o) => o.length),
    ],
    ["User Value Count", tryCatchLeap(p.getValues(), (o) => o.length)],
  ];

  const valuesPre = p.getValues();
  if (valuesPre.state === "fail") {
    return <div>failed</div>;
  }
  const values = valuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  const astValuesPre = p.getAstValues();
  if (astValuesPre.state === "fail") {
    return <div>failed</div>;
  }
  const astValues = astValuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  const defaultValuesPre = p.getDefaultValues();
  if (defaultValuesPre.state === "fail") {
    return <div>failed</div>;
  }
  const defaultValues = defaultValuesPre.value.map<ParameterTableValueTuple>(
    (v) => [
      v.type,
      tryCatch(v.type, () => v.defaultValue),
      // () => v.defaultValue as any,
      // () => v.defaultValue as any,
    ],
  );

  return (
    <>
      <SectionTitle>Param Props</SectionTitle>
      <PropertyTable rows={paramRows} />
      <SectionTitle>Merged Values</SectionTitle>
      <ParameterTable rows={values} />
      <SectionTitle>Ast Values</SectionTitle>
      <ParameterTable rows={astValues} />
      <SectionTitle>Default Values</SectionTitle>
      <ParameterTable rows={defaultValues} />
    </>
  );
};
