import { createFileRoute } from "@tanstack/react-router";
import { DocumentRender } from "../components/document-render/DocumentRender";

export const Route = createFileRoute("/")({
  component: DocumentRender,
});

// function RouteComponent() {
//   return <div>Hello "/"!</div>;
// }
