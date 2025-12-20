import { createRootRoute } from "@tanstack/react-router";
import Application from "../components/main/Application";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";

export const Route = createRootRoute({
  component: Application,
  // TODO
  errorComponent: (e) => (
    <ErrorFallback error={e} resetErrorBoundary={() => {}} />
  ),
});
