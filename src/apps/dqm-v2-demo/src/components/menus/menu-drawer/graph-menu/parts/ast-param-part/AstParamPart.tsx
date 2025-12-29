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
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { Typography } from "antd";

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
    return (
      <ExceptionCard>
        <Typography.Text code>IAstParamNode</Typography.Text> retrieval failed
      </ExceptionCard>
    );
  }
  const values = valuesPre.value.map<ParameterTableValueTuple>((v, i) => [
    v.type,
    tryCatch(i, () => v.value),
  ]);

  return (
    <>
      <SectionTitle parts={["code:IAstParamNode", "Value Props"]} />
      <PropertyTable rows={paramRows} />
      <SectionTitle parts={["code:IAstParamNode", "Values"]} />
      <ParameterTable rows={values} />
    </>
  );
};
