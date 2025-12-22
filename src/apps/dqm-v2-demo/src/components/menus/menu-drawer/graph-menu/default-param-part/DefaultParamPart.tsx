import type { IParam } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { SectionTitle } from "../section-title/SectionTitle";
import {
  ParameterTable,
  type ParameterTableRows,
} from "../tables/ParameterTable";

interface GraphMenuDefaultParamPartProps {
  param: IParam;
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

  const defaultValues: ParameterTableRows = p
    .getDefaultValues()
    .map((v) => [
      v.type,
      () => v.defaultValue as any,
      () => v.defaultValue as any,
    ]);

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
