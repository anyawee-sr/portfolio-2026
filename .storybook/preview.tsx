import type { Preview } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { fontVariables } from '../src/app/fonts'

import '../src/app/globals.css'
import './preview.css'

// Mirrors src/app/layout.tsx — Storybook's iframe doesn't render through
// the Next.js root layout, so the --font-montserrat/--font-bai-jamjuree
// variables next/font sets on <html> there never reach story previews
// unless we set them here too. Both files share the same next/font calls
// via src/app/fonts.ts, so there's nothing to keep in sync by hand.
const fontClasses = fontVariables.split(' ')

const preview: Preview = {
  decorators: [
    (Story) => {
      // Must land on <body> itself, not a wrapper <div> inside it:
      // globals.css resolves `body { font-family: var(--font-sans) }`,
      // and CSS custom properties are only visible to the element they're
      // set on plus its descendants — a div nested inside <body> can't
      // hand the variables back up to <body>'s own font-family rule.
      useEffect(() => {
        document.body.classList.add(...fontClasses)
        return () => {
          document.body.classList.remove(...fontClasses)
        }
      }, [])
      return <Story />
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
