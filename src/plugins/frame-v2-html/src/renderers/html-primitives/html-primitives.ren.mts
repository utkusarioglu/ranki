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
      chain: ["html", "primitive", "anchor", "container"],
      sync: (ser, pref, { parent }) => {
        const assertParent: Assertions["parent"] = parent;
        assertParent(ser, {});
        const element = document.createElement("a");
        element.classList.add("anchor-container");
        element.classList.add("leaf-container");
        const component = ser.props
          .component as HtmlPrimitiveAnchorComponentConfig;
        element.href = component.default.attribute.href;
        element.target = component.default.attribute.target;
        element.style.padding = "2px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.display = "inline-block";
        element.style.color = "#00F";

        element.addEventListener("mouseenter", () => {
          element.style.scale = "2";
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
