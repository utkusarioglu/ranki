import type {
  IAstNode,
  IAstParamNode,
  ICpsParam,
} from "@dqm/package-dqm-api-v2";
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

  // const userValuesPre = p.getValues();
  // if (userValuesPre.state === "fail") {
  //   return <div>failed</div>;
  // }
  // const userValues = userValuesPre.value.map<ParameterTableValueTuple>(
  //   (v, i) => [v.type, tryCatch(i, () => v.value)],
  // );

  // const defaultValuesPre = p.getDefaultValues();
  // if (defaultValuesPre.state === "fail") {
  //   return <div>failed</div>;
  // }
  // const defaultValues = defaultValuesPre.value.map<ParameterTableValueTuple>(
  //   (v) => [
  //     v.type,
  //     tryCatch(v.type, () => v.defaultValue),
  //     // () => v.defaultValue as any,
  //     // () => v.defaultValue as any,
  //   ],
  // );

  return (
    <>
      <SectionTitle>Param Props</SectionTitle>
      <PropertyTable rows={paramRows} />
      <SectionTitle>Source Values</SectionTitle>
      <ParameterTable rows={values} />
      {/* <SectionTitle>User Values</SectionTitle>
      <ParameterTable rows={userValues} />
      <SectionTitle>Default Values</SectionTitle>
      <ParameterTable rows={defaultValues} /> */}
    </>
  );
};
