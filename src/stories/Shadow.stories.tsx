import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ShadowTokens } from '@/stories/Shadow';

const meta = {
  title: 'Design Tokens/Shadow',
  component: ShadowTokens,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ShadowTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Shadow: Story = {
  tags: ['!dev'],
};
