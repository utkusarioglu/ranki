import style from "./IFrame.module.css";
import injected from "./IFrame.injected.css?raw";
import injectedDark from "./IFrame.injected.dark.css?raw";
import injectedLight from "./IFrame.injected.light.css?raw";
import resizeObserverTpl from "./IFrame.injected.resize.js.tpl?raw";

// import {
//   Render,
//   type RenderClientOptions,
//   type RenderFunctionReturn,
// } from "@ranki/package-render-v2";
// import type { TransformNode } from "@ranki/package-api-v2";
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
// import type { SyncFC } from "./react.type.mts";
import { ErrorFallback } from "../error-fallback/ErrorFallback";
import { pushScript, pushStyle } from "./utils.mts";
// import { AnkiUi } from "@ranki/package-anki-ui";

function wrapPromise(promise: Promise<any>) {
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
  requestHeight: (n: number) => void;
  id: string;
  colorScheme: string;
}

// ANKI
const AsyncHTMLElement: FC<AsyncHTMLElementProps> = ({
  promise,
  height,
  width,
  requestHeight: setHeight,
  id,
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
      if (e.data.type === `resize-${id}`) {
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
    pushScript(contentDocument, id, resizeObserverTpl);

    // if (!contentDocument.querySelector(`script.${name}-observer`)) {
    //   const sc = contentDocument.createElement("script");
    //   sc.className = name + "-observer";
    //   sc.innerText = `
    //   const observer = new ResizeObserver(() => {
    //     const rect = document.body.getBoundingClientRect();
    //     window.parent.postMessage({
    //       type: "resize-${name}",
    //       height: rect.height + rect.y,
    //     }, '*');
    //   });
    //   observer.observe(document.body);
    // `;
    //   contentDocument.head.appendChild(sc);
    // }

    pushStyle(contentDocument, "vars", injected);
    // if (!contentDocument.querySelector("style.vars")) {
    //   const vars = contentDocument.createElement("style");
    //   vars.className = "vars";
    //   vars.innerHTML = injected;
    //   contentDocument.head.appendChild(vars);
    // }

    switch (colorScheme) {
      case "dark":
        pushStyle(contentDocument, "dark", injectedDark);
        break;
      case "light":
        pushStyle(contentDocument, "light", injectedLight);
        break;
    }

    // contentDocument.body.style = Object.entries({
    //   color: colorScheme === "dark" ? "white" : "black",
    // })
    //   .map((p) => p.join(": "))
    //   .join("; ");

    contentDocument.body.innerText = "";
    const beforeUnmount: (() => {})[] = [];
    // const hud = AnkiUi.cardHud({
    //   hasReplacements: true,
    //   errorLevel: "none",
    //   parseMode: "v1",
    //   address: {
    //     prefix: ["hello"],
    //     exposed: ["All", "Dev", "Algo"],
    //     suffix: ["cat"],
    //   },
    //   tags: ["hello", "fricking", "world"],
    //   marked: true,
    //   flag: {
    //     type: 1,
    //     message: "Questionable information",
    //   },
    //   card: {
    //     type: "AB",
    //     face: "B",
    //   },
    // });
    // contentDocument.body.appendChild(hud.element);
    // const hudStyleExists = document.head.querySelector("style.anki-hud");
    // if (hudStyleExists) {
    //   document.head.removeChild(hudStyleExists);
    // }
    // const hudStyle = document.createElement("style");
    // hudStyle.className = "anki-hud";
    // hudStyle.textContent = hud.css.map(({ css }) => css).join("\n");
    // contentDocument.head.appendChild(hudStyle);

    // @ts-expect-error
    p.map((f) => {
      // @ts-expect-error
      f.css?.forEach(({ id, css }) => {
        const htmlId = id + "-" + id;
        pushStyle(contentDocument, htmlId, injected);
        // if (!contentDocument.querySelector(`style#${htmlId}`)) {
        //   const sc = contentDocument.createElement("style");
        //   sc.id = htmlId;
        //   sc.innerHTML = css;
        //   contentDocument.head.appendChild(sc);
        // }
      });

      contentDocument.body.appendChild(f.element);

      // @ts-expect-error
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
      className={[style.native, id].join(" ")}
      ref={ref}
    />
  );
};

export interface ResourceProps {
  // name: string;
  element: HTMLElement;
}

interface AsyncRenderProps {
  resource: Promise<ResourceProps[]>;
  options: { scheme: string };
  width: number;
  height: number;
  requestHeight: (height: number) => void;
}

export const AsyncIFrame: FC<AsyncRenderProps> = ({
  resource,
  options,
  width,
  height,
  requestHeight,
}) => {
  const promise = useMemo(
    // () => wrapPromise(Render.render(items, options)),
    () => wrapPromise(resource),
    [resource, options],
  );
  const [id] = useState("h" + Math.random().toString().slice(2));

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      // onReset={(details) => {
      //   // Reset the state of your app so the error doesn't happen again
      //   console.log(details);
      // }}
    >
      <Suspense
        fallback={
          <div
            style={{ height, width }}
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
          requestHeight={requestHeight}
          id={id}
          colorScheme={options.scheme}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
