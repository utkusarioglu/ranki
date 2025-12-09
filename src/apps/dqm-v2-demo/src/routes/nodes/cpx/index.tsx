import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nodes/cpx/")({
  component: () => {
    throw new Error("fds");
  },
});
