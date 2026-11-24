import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import { makeServer } from '@/mocks/server'
import '../src/index.css'
import { Providers } from './preview-providers'

if (import.meta.env.DEV || import.meta.env.VITE_MOCK_API !== 'false') {
  makeServer()
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      theme: themes.dark,
    },
  },
}

export default preview
