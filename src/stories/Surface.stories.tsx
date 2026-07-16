import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SurfaceTokens } from '@/stories/Surface';

const meta = {
  title: 'Design Tokens/Surfaces',
  component: SurfaceTokens,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SurfaceTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dotted: Story = {
  tags: ['!dev'],
};
