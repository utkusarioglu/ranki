import { renderPluginBaseV2Render } from "@ranki/plugin-render-base-v2";
import style from "./async.module.css";

Render.addPlugin(renderPluginBaseV2Render);

import {
  Render,
  type RenderClientOptions,
  type RenderFunctionReturn,
} from "@ranki/package-render-v2";
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
import type { SyncFC } from "../../react.type.mts";

function wrapPromise(promise: Promise<RenderFunctionReturn[]>) {
  let status = "pending";
  let result: Awaited<Parameters<typeof wrapPromise>[0]>;
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

// ANKI
const AsyncHTMLElement: FC<AsyncHTMLElementProps> = ({
  promise,
  height,
  setHeight,
  name,
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const p = promise.read();

  useEffect(() => {
    if (!(ref.current && ref.current.contentDocument)) {
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

    p.map((f) => {
      f.css?.forEach(({ id, css }) => {
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

      // return () => {
      //   window.removeEventListener("message", message);
      //   f.element.remove();
      // };
    });
  }, [p]);

  return (
    <iframe
      style={{ height }}
      className={[style.native, name].join(" ")}
      ref={ref}
    />
  );
};

interface AsyncRenderItem {
  items: TransformNode[];
  options: RenderClientOptions;
}

export const AsyncRender: FC<AsyncRenderItem> = ({ items, options }) => {
  const promise = useMemo(
    () => wrapPromise(Render.render(items, options)),
    [items],
  );
  const [height, setHeight] = useState<number>(60);
  const [name] = useState("h" + Math.random().toString().slice(2));

  return (
    <ErrorBoundary
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

interface FallbackRenderProps {
  error: Error;
  resetErrorBoundary: Function;
}

const FallbackRender: SyncFC<FallbackRenderProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <button onClick={() => resetErrorBoundary()}>Reset</button>
      <pre style={{ color: "red" }}>{error.stack}</pre>
    </div>
  );
};
