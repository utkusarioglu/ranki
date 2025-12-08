import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/info")({
  component: Info,
});

function Info() {
  return <div className="p-2">This is where info lives</div>;
}
