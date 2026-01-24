import "./utils/polyfills.mjs";
import { onReady } from "./utils/onReady.mjs";
import { createConfig } from "./config/config.mts";
import { createDesign } from "./theme/theme.mts";
import { hud, hudDefine } from "./components/hud/hud.mts";
import { hudAddressDefine } from "./components/hud/features/address/address.mts";
import { devMethods } from "./dev.mts";
import { hudAddressCrumbDefine } from "./components/hud/features/address/HudAddressCrumb.mts";
import { hudCardDefine } from "./components/hud/features/card/card.mts";
import { hudCuesDefine } from "./components/hud/features/cues/cues.mts";
import { hudCuesCueDefine } from "./components/hud/features/cues/hud-cue.mts";
import { hudTagsTagDefine } from "./components/hud/features/tags/HudTagsTag.mts";
import { hudTagsDefine } from "./components/hud/features/tags/tags.mts";
import { setStyles } from "./style/style.mts";
import { rankiFaces, rankiFacesDefine } from "./components/faces/faces.mts";
import { ruleHorizontalDefine } from "./components/faces/rules/hr.mts";
import { facesFaceDefine } from "./components/faces/face.mts";
import { ruleVerticalDefine } from "./components/faces/rules/vr.mts";

devMethods();
hudAddressDefine();
hudDefine();
hudAddressCrumbDefine();
hudCardDefine();
hudCuesCueDefine();
hudCuesDefine();
hudTagsTagDefine();
hudTagsDefine();
ruleHorizontalDefine();
ruleVerticalDefine();
rankiFacesDefine();
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
    console.log("RUN");
    if (!shouldRender()) {
      return;
    }

    setStyles();

    const config = await createConfig();
    hud(config.ranki.hud, document.body);
    document.body.classList.add("content-grid");

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
