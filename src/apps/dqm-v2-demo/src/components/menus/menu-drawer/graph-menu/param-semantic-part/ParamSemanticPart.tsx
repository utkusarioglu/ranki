import type { IAstParamNode, ICpsParam } from "@dqm/package-dqm-api-v2";
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

interface GraphMenuParamSemanticPartProps {
  param: ClassSanitizer<ICpsParam | IAstParamNode>;
}

export const GraphMenuParamSemanticPart: FC<
  GraphMenuParamSemanticPartProps
> = ({ param: p }) => {
  const paramRows: PropertyTableRows = [
    ["Audience", p.getAudience()],
    ["Operator", p.getOperator()],
    ["Channel", p.getChannel()],
    ["Alias", p.getAlias()],
    ["Chain", p.getChainString()],
    ["Producer", p.getProducer()],
    // ["Ast Value Count", tryCatchLeap(p.getAstValues(), (o) => o.length)],
  ];

  // const valuesPre = p.getValues();
  // if (valuesPre.state === "fail") {
  //   return <div>failed</div>;
  // }

  // const values = valuesPre.value.map<ParameterTableValueTuple>((v, i) => [
  //   v.type,
  //   tryCatch(i, () => v.value),
  // ]);

  // const defaultValues: ParameterTableRows = p
  //   .getDefaultValues()
  //   .map((v) => [
  //     v.type,
  //     () => v.defaultValue as any,
  //     () => v.defaultValue as any,
  //   ]);

  return (
    <>
      <SectionTitle>Semantic Props</SectionTitle>
      <PropertyTable rows={paramRows} />
      {/* <SectionTitle>Value Props</SectionTitle>
      <ParameterTable rows={values} /> */}
      {/* <SectionTitle>Default Value Props</SectionTitle>
      <ParameterTable rows={defaultValues} /> */}
    </>
  );
};
