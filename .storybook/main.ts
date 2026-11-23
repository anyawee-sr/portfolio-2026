import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["..\\public"],
  viteFinal: (config) =>
    mergeConfig(config, {
      server: {
        watch: {
          // Same list as vitest.config.ts — keep the two in sync.
          ignored: ["**/.next/**", "**/out/**", "**/storybook-static/**"],
        },
      },
    }),
};
export default config;
