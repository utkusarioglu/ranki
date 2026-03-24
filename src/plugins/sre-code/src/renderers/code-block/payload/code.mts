import { AnkiUi } from "@ranki/package-anki-ui";
import type Prism from "prismjs";

export function getLineNumbersHtml(source: string) {
  return Array(source.split("\n").length)
    .fill(null)
    .map((_, i) => (i + 1).toString().padStart(3, " "))
    .join("<br>");
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

export async function copyContent(elem: HTMLElement) {
  try {
    await navigator.clipboard.writeText(elem.innerText);
    console.log("Copied to clipboard:\n", elem.innerText);
  } catch (err) {
    console.log("Copy failed:\n", navigator.clipboard);
  }
}

export function createCodePayloadScaffolding() {
  const element = document.createElement("div");
  element.classList.add("code-block");
  const scroller = AnkiUi.horizontalScroller();
  element.appendChild(scroller.element);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.appendChild(code);
  scroller.getMount!().appendChild(pre);
  const content = document.createElement("span");
  code.appendChild(content);
  const left = scroller.subtree!.left();
  return { left, content, element, scroller };
}
