import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export function renderOsmd(div: HTMLElement, xml: string) {
  try {
    var osmd = new OpenSheetMusicDisplay(div);
    osmd.setOptions({
      backend: "svg",
      drawTitle: false,
      autoResize: false,
      drawComposer: false,
      drawCredits: false,
      drawPartAbbreviations: false,
      drawPartNames: false,
      drawingParameters: "compact", // don't display title, composer etc., smaller margins
    });
    osmd.load(xml).then(function () {
      osmd.EngravingRules.PageLeftMargin = 0;
      osmd.EngravingRules.PageRightMargin = 0;
      osmd.EngravingRules.PageTopMargin = 0;
      osmd.EngravingRules.PageBottomMargin = 0;
      // osmd.EngravingRules.StaffLineMargin = 0; // optional
      window.requestAnimationFrame(() => {
        osmd.Zoom = 0.7;
        osmd.render();
      });
    });
  } catch (e) {
    console.log(e);
    div.innerText = (e as Error).stack || (e as Error).message;
  }
}
