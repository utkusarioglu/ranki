import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import "prismjs/components/prism-yaml.js";
import QRCode from "qrcode";
import { collectEnvironmentInfo } from "../../env-info-yaml/payload/collect.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: () => {
    const element = document.createElement("div");
    const img = document.createElement("div");
    element.appendChild(img);
    element.style.padding = "1em";
    // element.style.width = "100%";
    img.style.width = "100%";
    img.style.aspectRatio = "1";
    img.style.backgroundSize = "contain";

    return {
      element,
      afterMount: [
        // ...(h.afterMount || []),
        async () => {
          // element.innerText = "";
          const data = await collectEnvironmentInfo();
          const str = JSON.stringify(data);

          QRCode.toDataURL(
            str,
            {
              // errorCorrectionLevel:
              margin: 0,
              color: { dark: "#151515", light: "#FFF" },
            },
            function (error, url) {
              if (error) console.error(error);
              console.log("success!", url, data);
              img.style.backgroundImage = `url(${url})`;
            },
          );
        },
      ],
    };
  },
};
