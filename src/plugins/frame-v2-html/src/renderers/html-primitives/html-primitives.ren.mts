import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
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
      kind: "parent",
      sync: ({ ser, pref }) => {
        const element = document.createElement("a");
        element.classList.add("anchor-container");
        element.classList.add("leaf-container");
        const component = ser.props
          .component as HtmlPrimitiveAnchorComponentConfig;
        const href = component.default.attribute.href;
        if (href === "") {
          // HACK
          // DECIDE  here the parent needed the value of the child. This may
          // come up in regular use and maybe this should be formalized for
          // parents so that this hacky access wouldn't need to happen
          const source =
            ser.children[0].kind === "leaf" ? ser.children[0].source : "/";
          const placeholder = component.default.link.placeholder;
          element.href = placeholder.replace("%", source);
        } else {
          element.href = href;
        }

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
      kind: "leaf",
      sync: ({ ser }) => {
        const element = document.createTextNode(ser.source);
        return {
          element,
        };
      },
    },
  ],
};
