import { Dqm } from "@dqm/package-dqm-v2";
import type {
  DqmParseInput,
  RenderRoots,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";
import { pluginsAsArray } from "./dqm.plugins.mts";
const fixed = {
  id: "pluginSelectionConfig",
  config: {
    plugins: {
      standards: [
        "render-engine:DqmStaticRenderer",
        "renderer:Debug",
        "grammar:ConstantsV2",
        "grammar:BaseV2",
        "component-set:BaseV2",
        "renderer:BaseV2",
        "component-set:FrameV2:Container",
        "grammar:FrameV2",
        "grammar:ParamsV2",
        "component-set:FrameV2:Code",
        "component-set:FrameV2:Audio",
        "component-set:FrameV2:Html",
        "renderer:HtmlPrimitives",
        "renderer:Audio",
        "renderer:Osmd",
        "renderer:Code",
        "component-set:FrameV2:Debug",
      ],
      requested: [
        "render-engine:DqmStaticRenderer",
        "renderer:Debug",
        "grammar:ConstantsV2",
        "grammar:BaseV2",
        "component-set:BaseV2",
        "renderer:BaseV2",
        "component-set:FrameV2:Container",
        "grammar:FrameV2",
        "grammar:ParamsV2",
        "component-set:FrameV2:Code",
        "component-set:FrameV2:Audio",
        "component-set:FrameV2:Html",
        "renderer:HtmlPrimitives",
        "renderer:Audio",
        "renderer:Osmd",
        "renderer:Code",
        "component-set:FrameV2:Debug",
      ],
    },
  },
};
// const fixedConfig = {
//   id: "pluginSelectionConfig",
//   config: {
//     plugins: {
//       standards: [
//         "render-engine:DqmStaticRenderer",
//         "renderer:Debug",
//         "grammar:ConstantsV2",
//         "grammar:BaseV2",
//         "component-set:BaseV2",
//         "renderer:BaseV2",
//         "component-set:FrameV2:Container",
//         "grammar:FrameV2",
//         "grammar:ParamsV2",
//         "component-set:FrameV2:Code",
//         "component-set:FrameV2:Html",
//         "renderer:HtmlPrimitives",
//         "component-set:FrameV2:Audio",
//         "renderer:Audio",
//       ],
//       requested: [
//         "render-engine:DqmStaticRenderer",
//         "renderer:Debug",
//         "grammar:ConstantsV2",
//         "grammar:BaseV2",
//         "component-set:BaseV2",
//         "renderer:BaseV2",
//         "component-set:FrameV2:Container",
//         "grammar:FrameV2",
//         "grammar:ParamsV2",
//         "component-set:FrameV2:Code",
//         "component-set:FrameV2:Html",
//         "renderer:HtmlPrimitives",
//         "component-set:FrameV2:Audio",
//         "renderer:Audio",
//       ],
//     },
//   },
// };

export function doDqm(
  inputs: DqmParseInput,
  roots: RenderRoots,
  pref: IDqmRendererClientPreferences,
  // inputs: any, faces: any
) {
  // console.log(inputs, roots);
  try {
    const dqm = new Dqm(
      // @ts-expect-error
      [fixed],
      pluginsAsArray,
      // [
      //   staticRender,
      //   baseV2,
      //   frameV2,
      //   frameV2Code,
      //   paramsV2,
      //   frameV2Html,
      //   frameV2Audio,
      //   sreMusic,
      //   sreOsmd,
      //   sreCode,
      // ],
    );
    // console.log(doc.querySelector("body"));
    // console.log(a);
    // assertExists(a, {
    //   why: "body element has to be available for dqm to render",
    // });
    dqm.render(inputs, roots, pref);
  } catch (e) {
    console.log("e", e);
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.inset = "0";
    div.style.color = "red";
    div.style.backgroundColor = "black";
    div.innerText = "something failed";
    document.body.appendChild(div);
    // throw new RankiAppError({
    //   code: "PARSE_FAIL",
    //   cause: e,
    //   why: "Dqm parsing or rendering failed",
    //   details: {},
    // });
  }
}
