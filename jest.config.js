// import { pathsToModuleNameMapper } from "ts-jest";

// // jest.config.js
// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   moduleFileExtensions: ["mts"],
//   preset: "ts-jest",
//   resolver: "ts-jest-resolver",
//   moduleNameMapper: pathsToModuleNameMapper({}, {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   }),
//   transform: {
//     // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
//     // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
//     '^.+\\.m?tsx?$': [
//       'ts-jest',
//       {
//         useESM: true,
//       },
//     ],
//   },
// };
import { defaults } from "jest-config";
import { pathsToModuleNameMapper } from "ts-jest";
import tsConfig from "./tsconfig.json" assert { type: "json" };

const jestConfigFactory = (tsConfig) =>
/** @type {import('jest').Config} */
({
  moduleFileExtensions: ["mts", ...defaults.moduleFileExtensions],
  // moduleFileExtensions: ["mts"],
  moduleNameMapper: pathsToModuleNameMapper(
    tsConfig.compilerOptions.paths || {},
    {
      useESM: true,
      prefix: "<rootDir>",
      isolatedModules: true,
    },
  ),
  testMatch: [
    ...defaults.testMatch,
    "**/__tests__/**/*.[mc][jt]s?(x)",
    "**/?(*.)+(spec|test).[mc][tj]s?(x)",
  ],
  transform: {
    "^.+\\.m?tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: {
          // HACK
          // https://github.com/kulshekhar/ts-jest/issues/4198
          moduleResolution: "classic",
        },
      },
    ],
  },
});

export default jestConfigFactory(tsConfig);
