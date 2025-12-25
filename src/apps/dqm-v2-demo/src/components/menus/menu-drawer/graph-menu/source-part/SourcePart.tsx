import type { IAstNode, IParam } from "@dqm/package-dqm-api-v2";
import { PreCode } from "_views/pre-code/PreCode";
import type { FC } from "react";
import { PropertyTable } from "../tables/PropertyTable";
import { SectionTitle } from "../section-title/SectionTitle";
import { type PropertyTableRows } from "../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mts";
import { TryCatchView } from "_views/try-catch/try-catch";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuSourcePartProps {
  node: ClassSanitizer<IAstNode> | ClassSanitizer<IParam>;
}

export const GraphMenuSourcePart: FC<GraphMenuSourcePartProps> = ({ node }) => {
  const rows: PropertyTableRows = [
    ["Length", tryCatchLeap(node.getSourceString(), (o) => o.length)],
  ];

  return (
    <>
      <SectionTitle>Source</SectionTitle>
      <TryCatchView
        item={node.getSourceString()}
        Success={({ item }) => <PreCode>{String(item.value)}</PreCode>}
      />
      {/* <PreCode>{sourceString}</PreCode> */}
      <PropertyTable rows={rows} />
    </>
  );
};
