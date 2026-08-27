import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";
import boundaries from "eslint-plugin-boundaries";
import sonarJs from "eslint-plugin-sonarjs";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      boundaries,
    },
    extends: ["js/recommended"],
    languageOptions: {
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
          category: "reconciler.public",
          pattern: "src/controllers/reconciler/reconciler.mts",
        },
        {
          category: "geometry.public",
          pattern: "src/controllers/geometry/geometry.mts",
        },
        {
          category: "component.r2c",
          pattern: "src/components/r2c/r2c.mts",
        },
        {
          category: "collect.public",
          pattern: "src/collect/collect.mts",
        },
      ],
      "boundaries/elements": [
        {
          type: "reconciler.internal",
          pattern: "src/controllers/reconciler",
        },
        {
          type: "geometry.internal",
          pattern: "src/controllers/geometry",
        },
        {
          type: "components",
          pattern: "src/components",
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "components" } },
              allow: { to: { file: { categories: "reconciler.public" } } },
            },
            {
              from: { file: { categories: "reconciler.public" } },
              allow: { to: { element: { type: "reconciler.internal" } } },
            },
            {
              from: { element: { type: "reconciler.internal" } },
              allow: { to: { element: { type: "reconciler.internal" } } },
            },
            {
              from: { element: { type: "components" } },
              allow: { to: { element: { type: "components" } } },
            },
            {
              from: { element: { type: "components" } },
              allow: { to: { file: { categories: "geometry.public" } } },
            },
            // {
            //   from: { file: { categories: "!geometry.public" } },
            //   disallow: {
            //     to: { element: { type: "geometry.internal" } },
            //   },
            // },
            {
              from: { file: { categories: "geometry.public" } },
              allow: { to: { element: { type: "geometry.internal" } } },
            },
            {
              from: { element: { type: "geometry.internal" } },
              allow: { to: { element: { type: "geometry.internal" } } },
            },
            {
              from: { element: { type: "geometry.internal" } },
              allow: { to: { file: { categories: "component.r2c" } } },
            },
          ],
        },
      ],

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
