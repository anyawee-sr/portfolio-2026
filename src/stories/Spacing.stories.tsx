// TODO: will hide a title `Spacing`
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SpacingTokens } from "@/stories/Spacing";

const meta = {
  title: "Design Tokens/Spacing",
  component: SpacingTokens,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SpacingTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  tags: ["!dev"],
};
