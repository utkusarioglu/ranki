import style from "./async.module.css";

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
import { AnkiUi } from "@ranki/package-anki-ui";

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
  width: number;
  setHeight: Dispatch<SetStateAction<number>>;
  name: string;
  colorScheme: string;
}

// ANKI
const AsyncHTMLElement: FC<AsyncHTMLElementProps> = ({
  promise,
  height,
  width,
  setHeight,
  name,
  colorScheme,
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
        const newHeight = e.data.height;
        setHeight(newHeight);
        // setHeight((currHeight) => {
        //   if (currHeight + 1 < newHeight || newHeight < currHeight - 1) {
        //     return newHeight;
        //   } else {
        //     return height;
        //   }
        // });
      }
    };

    // contentDocument.head.innerHTML = '<meta charset="UTF-7">';

    window.addEventListener("message", message);

    if (!contentDocument.querySelector(`script.${name}-observer`)) {
      const sc = contentDocument.createElement("script");
      sc.className = name + "-observer";
      sc.innerText = `
      const observer = new ResizeObserver(() => {
        const rect = document.body.getBoundingClientRect();
        window.parent.postMessage({
          type: "resize-${name}",
          height: rect.height + rect.y,
        }, '*');
      });
      observer.observe(document.body);
    `;
      contentDocument.head.appendChild(sc);
    }

    if (!contentDocument.querySelector("style.vars")) {
      const vars = contentDocument.createElement("style");
      vars.className = "vars";
      vars.innerHTML = `
        :root {
          --scrollbar-thumb-color: #FFFF00;
        }
        body {
          margin: 0;
          padding: 0;
          padding-top: 3em;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          font-family: Arial, Helvetica, sans-serif;
          
          /*
            This hack allows peaceful reconciliation of height
            between the child body and the iframe element.
            Setting height: 100% caused a runaway increase of height,
            this doesn't cause that.
          */
          &::after {
            content: "";
            display: block;
            height: 0.1px;
          }
        }
      `;
      contentDocument.head.appendChild(vars);
    }

    contentDocument.body.style = Object.entries({
      color: colorScheme === "dark" ? "white" : "black",
    })
      .map((p) => p.join(": "))
      .join("; ");

    contentDocument.body.innerText = "";
    const beforeUnmount: (() => {})[] = [];
    const hud = AnkiUi.cardHud({
      hasReplacements: true,
      errorLevel: "none",
      parseMode: "v1",
      address: {
        prefix: ["hello"],
        exposed: ["All", "Dev", "Algo"],
        suffix: ["cat"],
      },
      tags: ["hello", "fricking", "world"],
      marked: true,
      flag: {
        type: 1,
        message: "Questionable information",
      },
      card: {
        type: "AB",
        face: "B",
      },
    });
    contentDocument.body.appendChild(hud.element);
    const hudStyleExists = document.head.querySelector("style.anki-hud");
    if (hudStyleExists) {
      document.head.removeChild(hudStyleExists);
    }
    const hudStyle = document.createElement("style");
    hudStyle.className = "anki-hud";
    hudStyle.textContent = hud.css.map(({ css }) => css).join("\n");
    contentDocument.head.appendChild(hudStyle);

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

      contentDocument.body.appendChild(f.element);

      f.afterMount?.forEach((f) => f());

      f.beforeUnmount && beforeUnmount.push(...f.beforeUnmount);
    });
    return () => {
      beforeUnmount.forEach((f) => f());
    };
  }, [p, colorScheme]);

  return (
    <iframe
      style={{ height, width }}
      className={[style.native, name].join(" ")}
      ref={ref}
    />
  );
};

interface AsyncRenderProps {
  items: TransformNode[];
  options: RenderClientOptions;
  width: number;
}

export const AsyncRender: FC<AsyncRenderProps> = ({
  items,
  options,
  width,
}) => {
  const promise = useMemo(
    () => wrapPromise(Render.render(items, options)),
    [items, options],
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
          width={width}
          setHeight={setHeight}
          name={name}
          colorScheme={options.scheme}
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
