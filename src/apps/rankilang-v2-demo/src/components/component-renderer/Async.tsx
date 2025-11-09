// import { Render } from "@ranki/package-render-v2";
import { renderPluginBaseV2Render } from "@ranki/plugin-render-base-v2";
import style from "./async.module.css";

Render.addPlugin(renderPluginBaseV2Render);
import { Render, type RenderFunctionReturn } from "@ranki/package-render-v2";
import type { TransformNode } from "@ranki/package-api-v2";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
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
  height: number;
  setHeight: Dispatch<SetStateAction<number>>;
  name: string;
}

const AsyncHTMLElement: FC<AsyncHTMLElementProps> = ({
  promise,
  height,
  setHeight,
  name,
}) => {
  // const resource = useMemo(() => wrapPromise(promise), [promise]);
  const ref = useRef<HTMLIFrameElement>(null);
  const f = promise.read(); // Suspends here if promise not ready

  useEffect(() => {
    if (!(ref.current && ref.current.contentDocument && f.element)) {
      return;
    }
    const contentDocument = ref.current.contentDocument;

    const message = (e: MessageEvent<any>) => {
      if (e.data.type === `resize-${name}`) {
        setHeight(+e.data.height);
      }
    };

    window.addEventListener("message", message);

    if (!contentDocument.querySelector(`script.${name}-observer`)) {
      const sc = contentDocument.createElement("script");
      sc.className = name + "-observer";
      sc.innerText = `
      const observer = new ResizeObserver(() => {
      window.parent.postMessage({
        type: "resize-${name}",
        height: document.body.scrollHeight
        }, '*');
      });
      observer.observe(document.body);
    `;
      contentDocument.head.appendChild(sc);
    }

    contentDocument.body.style = Object.entries({
      display: "grid",
      overflow: "hidden",
      "justify-content": "center",
      "align-items": "center",
      "font-family": "Arial, Helvetica, sans-serif",
      color: "pink",
    })
      .map((p) => p.join(": "))
      .join("; ");

    // adds css from renders
    f.css?.forEach(({ id, css }) => {
      // const contentDocument = ref.current!.contentDocument!;
      const htmlId = name + "-" + id;
      if (!contentDocument.querySelector(`style#${htmlId}`)) {
        const sc = contentDocument.createElement("style");
        sc.id = htmlId;
        sc.innerHTML = css;
        contentDocument.head.appendChild(sc);
      }
    });

    f.onLoad?.forEach((f) => f());

    contentDocument.body.appendChild(f.element);

    return () => {
      window.removeEventListener("message", message);
      f.element.remove();
    };
  }, [f]);

  return (
    <iframe
      style={{ height }}
      className={[style.native, name].join(" ")}
      ref={ref}
    />
  );
};

interface AsyncRenderItemProps {
  item: TransformNode;
}

const AsyncRenderItem: FC<AsyncRenderItemProps> = ({ item }) => {
  const promise = useMemo(() => wrapPromise(Render.render(item)), [item]);
  const [height, setHeight] = useState<number>(60);
  const [name] = useState("h" + Math.random().toString().slice(2));

  return (
    <ErrorBoundary
      // @ts-expect-error
      fallbackRender={FallbackRender}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
        console.log(details);
      }}
    >
      <Suspense
        fallback={
          <div
            style={{ height }}
            className={[style.native, style.loading, "monospace"].join(" ")}
          >
            <pre>Loading…</pre>
          </div>
        }
      >
        <AsyncHTMLElement
          promise={promise}
          height={height}
          setHeight={setHeight}
          name={name}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

interface AsyncRenderProps {
  items: TransformNode[];
}

export const AsyncRender: FC<AsyncRenderProps> = ({ items }) => (
  <>
    {items.map((item, i) => (
      <AsyncRenderItem key={i} item={item} />
    ))}
  </>
);

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
