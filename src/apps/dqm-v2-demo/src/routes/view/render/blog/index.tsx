import { DocumentRender } from "_displays/document-render/DocumentRender";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/render/blog/")({
  component: DocumentRender,
});
