import { AnkiUi } from "@ranki/package-anki-ui";
import type Prism from "prismjs";
import codeBlockCss from "./code-block.css?raw";

export function getLineNumbersHtml(source: string) {
  const count = Array(source.split("\n").length);
  const digits = count.toString().length;

  return (
    count
      .fill(null)
      .map((_, i) => (i + 1).toString().padStart(digits, " "))
      // .map((v) => `<span>${v}</span>`)
      // .map((v) => `${v}</span>`)
      .join("<br>")
  );
}

export function getHighlightedCodeHtml(
  p: typeof Prism,
  rawName: string,
  raw: string,
  noLanguage: string,
) {
  const highlighted =
    rawName === noLanguage
      ? raw
      : p.highlight(raw, p.languages[rawName], rawName);
  return highlighted;
}

export function getProcessedSource(source: string, noEmptyLines: boolean) {
  const raw = noEmptyLines ? source.replace(/^[\r\n]+|[\r\n]+$/g, "") : source;
  return raw;
}

async function copyContent(elem: HTMLElement) {
  try {
    await navigator.clipboard.writeText(elem.innerText);
    console.log("Copied to clipboard:\n", elem.innerText);
  } catch (err) {
    console.log("Copy failed:\n", navigator.clipboard);
  }
}

export function createCodePayloadScaffolding(
  prismCss: string,
  fontSize: string,
  lineHeight: string,
) {
  const element = document.createElement("div");
  element.classList.add("code-block");
  const scroller = AnkiUi.horizontalScroller();
  element.appendChild(scroller.element);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.appendChild(code);
  scroller.getMount!().appendChild(pre);
  const left = scroller.subtree!.left();

  if (fontSize !== "") {
    element.style.setProperty("--smaller-font-size", fontSize);
  }
  if (lineHeight !== "") {
    element.style.setProperty("--smaller-line-height", lineHeight);
  }

  const onClick = () => copyContent(code);
  const css = [
    ...scroller.css!,
    {
      id: "prism-atom-dark",
      css: prismCss,
    },
    {
      id: "code-block-section",
      css: codeBlockCss,
    },
  ];
  const afterMount = [
    ...(scroller.afterMount || []),
    () => {
      element.addEventListener("click", onClick);
    },
  ];
  const beforeUnmount = [
    ...(scroller.beforeUnmount || []),
    () => {
      element.removeEventListener("click", onClick);
    },
  ];

  return {
    left,
    content: code,
    element,
    scroller,
    css,
    afterMount,
    beforeUnmount,
  };
}
