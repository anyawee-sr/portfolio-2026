// TODO: will hide a title `Typography`
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TypographyTokens } from '@/stories/Typography';

const meta = {
  title: 'Design Tokens/Typography',
  component: TypographyTokens,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  tags: ['!dev'],
};
