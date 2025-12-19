import { createFileRoute } from "@tanstack/react-router";
import { AstGraph } from "_displays/graph/AstGraph";

export const Route = createFileRoute("/view/graph/")({
  component: AstGraph,
});
