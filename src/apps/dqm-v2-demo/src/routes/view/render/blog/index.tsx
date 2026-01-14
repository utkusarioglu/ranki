import { createFileRoute } from "@tanstack/react-router";
import { DocumentRender } from "_displays/document-render/DocumentRender";

export const Route = createFileRoute("/view/render/blog/")({
  component: DocumentRender,
});
