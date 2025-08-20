import type { PluginComponentRenderer } from "@ranki/package-api";
import { Html } from "@ranki/package-html";

export const renderer: PluginComponentRenderer = (t) => {
  switch (t.kind) {
    case "leaf":
      const leafElem = Html.single(t.tag, {
        format: "text",
        className: t.classNames,
        style: t.styles,
        content: t.text,
      });
      return {
        selector: "made-up-selector-01",
        component: "made-up-component",
        element: leafElem,
      };
    case "parent":
      const parentElem = Html.single(t.tag, {
        format: "html",
        className: t.classNames,
        style: t.styles,
        children: [],
        // content: JSON.stringify(t),
      });
      return {
        selector: "made-up-selector-01",
        component: "made-up-component",
        element: parentElem,
        inserts: {
          children: parentElem,
        },
      };
  }
};
