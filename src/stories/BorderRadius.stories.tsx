import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BorderRadiusTokens } from '@/stories/BorderRadius';

const meta = {
  title: 'Design Tokens/Border Radius',
  component: BorderRadiusTokens,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BorderRadiusTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BorderRadius: Story = {
  tags: ['!dev'],
};
