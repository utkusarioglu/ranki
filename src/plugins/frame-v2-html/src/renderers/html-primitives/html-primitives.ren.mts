import type { IDqmPluginRenderer, Assertions } from "@dqm/package-dqm-api-v2";
import type { HtmlPrimitiveAnchorComponentConfig } from "../../components/anchor/anchor.mjs";

export const htmlPrimitivesRenderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "HtmlPrimitives",
    engine: "DqmStaticRenderer",
    description: "Unopinionated html primitives",
    version: "0.0.0",
  },
  list: [
    {
      load: "sync",
      chain: ["html", "primitive", "anchor", "container"],
      sync: (ser, pref, { parent }) => {
        const assertParent: Assertions["parent"] = parent;
        assertParent(ser, {});
        const element = document.createElement("a");
        element.classList.add("anchor-container");
        element.classList.add("leaf-container");
        element.href = (
          ser.props.component as HtmlPrimitiveAnchorComponentConfig
        ).default.attribute.href;
        element.style.padding = "2px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";

        element.addEventListener("mouseenter", () => {
          element.style.scale = "1.5";
        });
        element.addEventListener("mouseleave", () => {
          element.style.scale = "1";
        });
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      load: "sync",
      chain: ["html", "primitive", "anchor", "payload"],
      sync: (ser, _pref, { leaf }) => {
        const assertLeaf: Assertions["leaf"] = leaf;
        assertLeaf(ser, {});
        const element = document.createTextNode(ser.source);
        return {
          element,
        };
      },
    },
  ],
};
