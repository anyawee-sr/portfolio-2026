// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated output — not source, mirrors .gitignore:
    "storybook-static/**",
    "coverage/**",
    "design-ref/**",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*", "!./*.css", "!../*.css", "!**/*.css"],
              message:
                'Use the "@/*" alias import instead of a relative import.',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
