import type { IParam, ParamDefaultValue } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { SectionTitle } from "../section-title/SectionTitle";
import {
  ParameterTable,
  type ParameterTableValueTuple,
} from "../tables/ParameterTable";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { tryCatch, type TryCatch } from "_utils/utils.mjs";

interface GraphMenuDefaultParamPartProps {
  param: ClassSanitizer<IParam>;
}

export const GraphMenuDefaultParamPart: FC<GraphMenuDefaultParamPartProps> = ({
  param: p,
}) => {
  // const paramRows: PropertyTableRows = [
  //   ["Audience", () => p.getAudience()],
  //   ["Operator", () => p.getOperator()],
  //   ["Alias", () => p.getId().getAlias()],
  //   ["Chain", () => p.getId().getChain()],
  //   ["Producer", () => p.getProducer()],
  //   ["Value Count", () => p.getValues().length],
  // ];

  // const values: ParameterTableRows = p
  //   .getValues()
  //   .map((v) => [v.type, () => v.raw, () => v.value]);

  const defaultValuesPre: TryCatch<ParamDefaultValue[]> = p.getDefaultValues();
  // ParameterTableRows[]
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
      {/* <SectionTitle>Param Props</SectionTitle>
      <PropertyTable rows={paramRows} />
      <SectionTitle>Value Props</SectionTitle>
      <ParameterTable rows={values} /> */}
      <SectionTitle>Default Value Props</SectionTitle>
      <ParameterTable rows={defaultValues} />
    </>
  );
};
