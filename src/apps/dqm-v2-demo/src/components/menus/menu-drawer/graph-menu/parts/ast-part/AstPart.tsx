import { type FC } from "react";
import { type PropertyTableRows } from "../../tables/PropertyTable";
import type { IAstNode } from "@dqm/package-dqm-api-v2";
import {
  SectionTitle,
  SectionTitleCode,
} from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import type { ClassSanitizer } from "_utils/sanitizer.mts";
import { tryCatchLeap } from "_utils/utils.mjs";

interface GraphMenuAstPartProps {
  ast: ClassSanitizer<IAstNode>;
}

export const GraphMenuAstPart: FC<GraphMenuAstPartProps> = ({ ast: a }) => {
  const astRows: PropertyTableRows = [
    ["Creator", a.getCreator()],
    ["Kind", a.getKind()],
    ["Block Depth", a.getBlockDepth()],
    ["Inline Depth", a.getBlockDepth()],
    ["Creation Method", a.getCreationMethod()],
    ["Direction", a.getDirection()],
    ["Relationship", a.getRelationship()],
    ["Nature", a.getNature()],
    ["Meaning", a.getMeaning()],
    ["Token Count", tryCatchLeap(a.getTokenNodes(), (o) => o.length)],
    ["Space Count", tryCatchLeap(a.getSpaceNodes(), (o) => o.length)],
    ["Subtree Count", tryCatchLeap(a.getSubtreeNodes(), (o) => o.length)],
    ["Children Count", tryCatchLeap(a.getChildrenNodes(), (o) => o.length)],
    ["Child Index", a.getChildIndex()],
  ];

  return (
    <>
      <SectionTitle>
        <SectionTitleCode>IAstNode</SectionTitleCode> Props
      </SectionTitle>
      <PropertyTable rows={astRows} />
    </>
  );
};
