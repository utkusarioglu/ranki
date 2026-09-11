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
          category: "reconciliation-controller.public",
          pattern: "src/controllers/reconciler/reconciler.mts",
        },
        {
          category: "geometry-controller.public",
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
        {
          category: "store.public",
          pattern: "src/store/store.mts",
        },
        {
          category: "store-controller.public",
          pattern: "src/controllers/store/store.mts",
        },
      ],
      "boundaries/elements": [
        {
          type: "reconciliation-controller.internal",
          pattern: "src/controllers/reconciler",
          exclude: ["src/controllers/reconciler/reconciler.mts"],
        },
        {
          type: "geometry-controller.internal",
          pattern: "src/controllers/geometry",
          exclude: ["src/controllers/geometry/geometry.mts"],
        },
        {
          type: "store-controller.internal",
          pattern: "src/controllers/store",
          exclude: ["src/controllers/store/store.mts"],
        },
        {
          type: "components",
          pattern: "src/components",
        },
        {
          type: "store.internal",
          pattern: "src/store",
          exclude: ["src/store/store.mts"],
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
              allow: {
                to: {
                  file: { categories: "store.public" },
                },
              },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: {
                  file: { categories: "store-controller.public" },
                },
              },
            },
            {
              from: { element: { type: "store-controller.internal" } },
              allow: { to: { file: { categories: "store.public" } } },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: {
                  file: { categories: "reconciliation-controller.public" },
                },
              },
            },
            {
              from: {
                file: { categories: "reconciliation-controller.public" },
              },
              allow: {
                to: { element: { type: "reconciliation-controller.internal" } },
              },
            },
            {
              from: { element: { type: "reconciliation-controller.internal" } },
              allow: {
                to: { element: { type: "reconciliation-controller.internal" } },
              },
            },
            {
              from: { element: { type: "components" } },
              allow: { to: { element: { type: "components" } } },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: { file: { categories: "geometry-controller.public" } },
              },
            },
            {
              from: { element: { type: "store.internal" } },
              allow: { to: { file: { categories: "collect.public" } } },
            },
            {
              from: { element: { type: "geometry-controller.internal" } },
              allow: {
                to: {
                  file: { categories: "reconciliation-controller.public" },
                },
              },
            },
            {
              from: { file: { categories: "geometry-controller.public" } },
              allow: {
                to: { element: { type: "geometry-controller.internal" } },
              },
            },
            {
              from: { element: { type: "geometry-controller.internal" } },
              allow: {
                to: { element: { type: "geometry-controller.internal" } },
              },
            },
            {
              from: { element: { type: "geometry-controller.internal" } },
              allow: { to: { file: { categories: "component.r2c" } } },
            },
            {
              from: {
                file: { categories: "store-controller.public" },
              },
              allow: {
                to: { element: { type: "store-controller.internal" } },
              },
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
