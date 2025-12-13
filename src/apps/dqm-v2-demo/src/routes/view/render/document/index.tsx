import { createFileRoute } from "@tanstack/react-router";
import { DocumentRender } from "../../../../components/document-render/DocumentRender";

export const Route = createFileRoute("/view/render/document/")({
  component: DocumentRender,
});

// function RouteComponent() {
//   return <div>Hello "/"!</div>;
// }
