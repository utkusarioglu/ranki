import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../error-fallback/ErrorFallback";
import { Scroller } from "../scroller/Scroller";

export const ContentContainer = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Scroller direction="vertical">
        <Outlet />
      </Scroller>
    </ErrorBoundary>
  );
};
