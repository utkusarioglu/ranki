import { createFileRoute } from "@tanstack/react-router";
import { SanitizedNodeList } from "../../../../components/sanitized-node-list/SanitizedNodeList";

export const Route = createFileRoute("/view/nodes/ast/")({
  component: SanitizedNodeList,
});
