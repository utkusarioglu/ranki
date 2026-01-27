import "./utils/polyfills.mjs";
import { onReady } from "./utils/onReady.mjs";
import { createConfig } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { Hud } from "./components/hud/hud.mts";
import { devMethods } from "./dev.mts";
import { setStyles } from "./style/style.mts";
import { rankiFaces, rankiFacesDefine } from "./components/faces/faces.mts";
import { ruleHorizontalDefine } from "./components/faces/rules/hr.mts";
import { facesFaceDefine } from "./components/faces/face/face.mts";
import { ruleVerticalDefine } from "./components/faces/rules/vr.mts";
import { facesPairDefine } from "./components/faces/pair/pair.mts";

devMethods();
ruleHorizontalDefine();
ruleVerticalDefine();
rankiFacesDefine();
facesPairDefine();
facesFaceDefine();

function shouldRender() {
  const qa = document.querySelector("#qa")!;
  let r = qa.querySelector("div.rendered");
  if (r) {
    return false;
  }
  r = document.createElement("div");
  r.className = "rendered";
  qa.appendChild(r);
  return true;
}

/**
 * @dev
 * #1 DECIDE THis is below data collection because there may be a hash involved
 * in determining whether to render a certain face
 */
async function main() {
  try {
    if (!shouldRender()) {
      return;
    }

    setStyles();

    const config = await createConfig();
    Hud.singleton(config.ranki.hud, document.body);

    createDesign(document, config.ranki);
    // TODO indicators
    // createIndicators(root, config.ranki);
    rankiFaces({ faces: config.ranki.order, dqm: config.dqm }, document.body);
  } catch (e) {
    const { createAppErrorScreen } =
      await import("./components/general-error/general-error.mjs");
    createAppErrorScreen(document.body, e);
  }
}

onReady(main);
