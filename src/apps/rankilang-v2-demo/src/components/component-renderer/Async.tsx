// import { Render } from "@ranki/package-render-v2";
import { renderPluginBaseV2Render } from "@ranki/plugin-render-base-v2";

Render.addPlugin(renderPluginBaseV2Render);
import { Render, type RenderFunctionReturn } from "@ranki/package-render-v2";
import type { TransformNode } from "@ranki/package-api-v2";
import { Suspense, useEffect, useMemo, useRef, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";

function wrapPromise(promise: Promise<RenderFunctionReturn>) {
  let status = "pending";
  let result: RenderFunctionReturn;
  const suspender = promise
    .then((r) => {
      status = "success";
      result = r;
    })
    .catch((e) => {
      status = "error";
      result = e;
    });

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}

interface AsyncHTMLElementProps {
  promise: ReturnType<typeof wrapPromise>;
}

const AsyncHTMLElement: FC<AsyncHTMLElementProps> = ({ promise }) => {
  // const resource = useMemo(() => wrapPromise(promise), [promise]);
  const ref = useRef<HTMLDivElement>(null);
  const f = promise.read(); // Suspends here if promise not ready

  useEffect(() => {
    ref.current?.appendChild(f.element);
    return () => f.element.remove();
  }, [f]);

  return <div ref={ref} />;
};

interface AsyncRenderProps {
  item: TransformNode;
}

export const AsyncRender: FC<AsyncRenderProps> = ({ item }) => {
  const promise = useMemo(() => wrapPromise(Render.render(item)), [item]);

  return (
    <ErrorBoundary
      // @ts-expect-error
      fallbackRender={FallbackRender}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
        console.log(details);
      }}
    >
      <Suspense fallback={<div>Loading async element...</div>}>
        <AsyncHTMLElement promise={promise} />
      </Suspense>
    </ErrorBoundary>
  );
};

interface FallbackRenderProps {
  error: Error;
  resetErrorBoundary: Function;
}

const FallbackRender: FC<FallbackRenderProps> = ({
  error,
  // resetErrorBoundary,
}) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      {/* <pre style={{ color: "red" }}>{error.message}</pre> */}
      <pre style={{ color: "red" }}>{error.stack}</pre>
    </div>
  );
};
