import { createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Application from "../components/application/Application";

export const Route = createRootRoute({ component: Application });
