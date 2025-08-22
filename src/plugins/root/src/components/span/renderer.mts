import type { PluginComponentRenderer } from "@ranki/package-api";
import { Html } from "@ranki/package-html";

export const renderer: PluginComponentRenderer = (t) => {
  switch (t.kind) {
    case "leaf":
      // TODO span needs to return either a text node
      // or a span element depending on the content characteristics
      return {
        selector: "",
        component: "",
        element: document.createTextNode(t.text),
      };
    // const leafElem = Html.single(t.tag, {
    //   format: "text",
    //   content: t.text,
    // });
    // return {
    //   selector: "made-up-selector-01",
    //   component: "made-up-component",
    //   element: leafElem,
    // };
    case "parent":
      const parentElem = Html.single(t.tag, {
        format: "html",
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
