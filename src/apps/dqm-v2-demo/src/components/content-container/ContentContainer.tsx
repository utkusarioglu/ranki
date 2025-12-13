import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../error-fallback/ErrorFallback";
import { Scroller } from "../scroller/Scroller";
import { useCodeStore } from "../../stores/dqm/dqm.store.mts";

export const ContentContainer = () => {
  const code = useCodeStore();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      key={JSON.stringify(code.inputs)}
    >
      <Scroller direction="vertical">
        <Outlet />
      </Scroller>
    </ErrorBoundary>
  );
};
