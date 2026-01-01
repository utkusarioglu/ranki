// import type {
//   Chain,
//   ChainString,
//   CreatorName,
//   IDqmComponent,
//   IDqmComponentCpsTransformer,
//   IPluginLib,
// } from "@dqm/package-dqm-api-v2";
// import { assertNotExists } from "../../errors/dqm-app-error/assertions.mjs";
// import { assertExists } from "@dqm/package-dqm-utils";

// type TransformMap = Map<ChainString, IDqmComponentCpsTransformer>;

// type Criteria = { chain: Chain };

// export type ILibTransformer = IPluginLib<
//   IDqmComponent,
//   IDqmComponentCpsTransformer,
//   Criteria
// >;

// export class TransformLib implements ILibTransformer {
//   private transformers: TransformMap = new Map();

//   add(comp: IDqmComponent): ILibTransformer {
//     Object.entries(comp.transformers).forEach(([creator, transformer]) => {
//       assertNotExists(this.transformers.get(creator), {
//         why: "No two transformer should have the same creator",
//       });
//       this.transformers.set(creator, transformer);
//     });
//     return this;
//   }

//   get(c: Criteria): IDqmComponentCpsTransformer {
//     const t = this.transformers.get(c.creator);
//     assertExists(t, {
//       why: "A required transformer has not been installed by any of the plugins",
//       details: {
//         creator: c.creator,
//       },
//     });
//     return t;
//   }
// }
