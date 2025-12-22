import { type FC } from "react";
import { type PropertyTableRows } from "../tables/PropertyTable";
import type { IAstNode } from "@dqm/package-dqm-api-v2";
import { SectionTitle } from "../section-title/SectionTitle";
import { PropertyTable } from "../tables/PropertyTable";

interface GraphMenuAstPartProps {
  ast: IAstNode;
}

export const GraphMenuAstPart: FC<GraphMenuAstPartProps> = ({ ast: a }) => {
  const astRows: PropertyTableRows = [
    ["Creator", () => a.getCreator()],
    ["Kind", () => a.getKind()],
    ["Block Depth", () => a.getBlockDepth()],
    ["Inline Depth", () => a.getBlockDepth()],
    ["Creation Method", () => a.getCreationMethod()],
    ["Direction", () => a.getDirection()],
    ["Relationship", () => a.getRelationship()],
    ["Nature", () => a.getNature()],
    ["Meaning", () => a.getMeaning()],
    ["Token Count", () => a.getTokenNodes().length],
    ["Space Count", () => a.getSpaceNodes().length],
    ["Subtree Count", () => a.getSubtreeNodes().length],
    ["Children Count", () => a.getChildrenNodes().length],
    ["Child Index", () => a.getChildIndex()],
  ];

  return (
    <>
      <SectionTitle>Ast Props</SectionTitle>
      <PropertyTable rows={astRows} />
    </>
  );
};
