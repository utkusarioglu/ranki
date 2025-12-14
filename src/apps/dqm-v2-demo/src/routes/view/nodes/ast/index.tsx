import { createFileRoute } from "@tanstack/react-router";
import { SanitizedNodeList } from "_displays/sanitized-ast-node-list-display/SanitizedAstNodeListDisplay";

export const Route = createFileRoute("/view/nodes/ast/")({
  component: SanitizedNodeList,
});
