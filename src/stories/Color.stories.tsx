// TODO: will hide a title `Colors`
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ColorTokens } from "@/stories/Color";

const meta = {
  title: "Design Tokens/Colors",
  component: ColorTokens,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Color: Story = {
  tags: ["!dev"],
};
