import type { IAstNode, IAstParamNode } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import type { FC } from "react";

import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { PreCode } from "_views/pre-code/PreCode";
import { TryCatchView } from "_views/try-catch/try-catch";
import { tryCatchLeap } from "@dqm/package-dqm-v2-debug";

import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import { type PropertyTableRows } from "../../tables/PropertyTable";

interface GraphMenuSourcePartProps {
  node: ClassSanitizer<IAstNode> | ClassSanitizer<IAstParamNode>;
}

export const GraphMenuSourcePart: FC<GraphMenuSourcePartProps> = ({ node }) => {
  const rows: PropertyTableRows = [
    ["Length", tryCatchLeap(node.getSourceString(), (o) => o.length)],
    ["Start Index", node.getStartIndex()],
    ["End Index", node.getEndIndex()],
  ];

  return (
    <>
      <SectionTitle>Source</SectionTitle>
      <TryCatchView
        Fail={() => <ExceptionCard>Source code retrieval failed</ExceptionCard>}
        item={node.getSourceString()}
        Success={({ item }) => <PreCode>{String(item.value)}</PreCode>}
      />
      <PropertyTable rows={rows} />
    </>
  );
};
