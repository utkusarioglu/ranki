import { AstGraph } from "_displays/graph/AstGraph";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/graph/")({
  component: AstGraph,
});
