import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "_views/error-fallback/ErrorFallback";
import { Scroller } from "_views/scroller/Scroller";
import { useDqmStore } from "_stores/dqm/dqm.store.mts";

export const DisplayContainer = () => {
  // const { parseEpoch } = useDqmStore();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} key={""}>
      <Scroller direction="vertical">
        <Outlet />
      </Scroller>
    </ErrorBoundary>
  );
};
