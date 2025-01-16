import type { StorybookConfig } from "@storybook/types";

const config: StorybookConfig = {
  stories: ["./src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react",
    options: {},
  },
};

export default config;