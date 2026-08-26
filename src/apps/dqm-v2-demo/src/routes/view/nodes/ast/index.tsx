import { SanitizedNodeList } from "_displays/sanitized-ast-node-list-display/SanitizedAstNodeListDisplay";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/nodes/ast/")({
  component: SanitizedNodeList,
});
