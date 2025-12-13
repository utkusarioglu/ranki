import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/nodes/cpx/")({
  component: () => {
    throw new Error("fds");
  },
});
