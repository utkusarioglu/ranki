import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";
import boundaries from "eslint-plugin-boundaries";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      boundaries,
      // perfectionist,
    },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    settings: {
      "boundaries/elements": [
        {
          type: "geometry-controller.public",
          pattern: "src/controllers/geometry/geometry.mts",
        },
        // {
        //   type: "geometry-controller.internal",
        //   pattern: "src/controllers/geometry/**/*.mts",
        // },
        {
          type: "components",
          pattern: "src/components/**/*.mts",
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: {
            from: { element: { type: "geometry-controller.public" } },
            allow: {
              to: { element: { type: "components" } },
            },
          },
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
]);
