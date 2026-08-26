import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import boundaries from "eslint-plugin-boundaries";
import sonarJs from "eslint-plugin-sonarjs";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      js,
      boundaries,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/files": [
        {
          category: "geometry-controller.public",
          pattern: "src/controllers/geometry/geometry.mts",
        },
        {
          category: "component.r2c",
          pattern: "src/components/r2c/r2c.mts",
        },
      ],
      "boundaries/elements": [
        {
          type: "geometry-controller.internal",
          pattern: "src/controllers/geometry/**/*",
        },
        {
          type: "components",
          pattern: "src/components/**/*",
        },
      ],
    },
    rules: {
      // "boundaries/dependencies": [
      //   "error",
      //   {
      //     default: "disallow",
      //     policies: [
      //       {
      //         from: { element: { type: "components" } },
      //         allow: {
      //           to: { element: { type: "components" } },
      //         },
      //       },
      //       {
      //         from: { element: { type: "components" } },
      //         allow: {
      //           to: { file: { categories: "geometry-controller.public" } },
      //         },
      //       },
      //       {
      //         from: { file: { categories: "!geometry-controller.public" } },
      //         disallow: {
      //           to: { element: { type: "geometry-controller.internal" } },
      //         },
      //       },
      //       {
      //         from: { file: { categories: "geometry-controller.public" } },
      //         allow: {
      //           to: { element: { type: "geometry-controller.internal" } },
      //         },
      //       },
      //       {
      //         from: { element: { type: "geometry-controller.internal" } },
      //         allow: {
      //           to: { element: { type: "geometry-controller.internal" } },
      //         },
      //       },
      //       {
      //         from: { element: { type: "geometry-controller.internal" } },
      //         allow: {
      //           to: { file: { categories: "component.r2c" } },
      //         },
      //       },
      //     ],
      //   },
      // ],

      // "perfectionist/sort-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description",
          "ts-expect-error": "allow-with-description",
          minimumDescriptionLength: 2,
        },
      ],
    },
  },
  tseslint.configs.recommended,
  perfectionist.configs["recommended-alphabetical"],
  // @ts-expect-error internal type error that doesn't concern this repo
  sonarJs.configs.recommended,
  {
    rules: {
      "sonarjs/todo-tag": "off",
    },
  },
]);
