import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'

import { Infobox, type InfoboxData } from './infobox'

function svgImage(label: string, background: string, width: number, height: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="${Math.round(width / 10)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const characterData: InfoboxData = {
  title: 'Aria Voss',
  subtitle: 'The Wandering Blade',
  images: [
    { src: svgImage('Young', '#475569', 300, 400), alt: 'Aria as a young woman', tab: 'Young', caption: 'Aria during the Academy years' },
    { src: svgImage('Older', '#334155', 300, 400), alt: 'Aria in her later years', tab: 'Older', caption: 'Aria after the Sundering' },
  ],
  sections: [
    { title: 'Biographical information', rows: [
      { label: 'Born', value: '3rd Age, 412' },
      { label: 'Homeland', value: { label: 'Ashenfall', href: '#ashenfall' } },
      { label: 'Age', value: 34 },
    ] },
    { title: 'Affiliations', rows: [
      { label: 'Factions', value: [{ label: 'Silver Order', href: '#silver-order' }, 'Free Blades'] },
      { label: 'Titles', value: ['Knight-Errant', 'Warden of the East'] },
    ] },
  ],
}

const sectionTabsData: InfoboxData = {
  title: 'Aria Voss',
  subtitle: 'The Wandering Blade',
  sections: [
    { title: 'Biographical information', rows: [{ label: 'Born', value: '3rd Age, 412' }] },
    { title: 'Early years', tab: 'History', rows: [{ label: 'Academy', value: 'Silver Order, 3rd Age 428' }] },
    { title: 'Combat', tab: 'Abilities', rows: [{ label: 'Weapon', value: 'Twin sabers' }, { label: 'Styles', value: ['Riverdance', 'Ash Step'] }] },
  ],
}

const meta = {
  title: 'Cyphix/Infobox',
  component: Infobox,
  tags: ['autodocs'],
  args: {
    data: characterData,
    accentColor: undefined,
    imageFit: 'cover',
    imageRatio: 1.5,
    onImageClick: undefined,
  },
  argTypes: {
    data: { control: false },
    accentColor: { control: 'color' },
    imageFit: { control: 'select', options: ['contain', 'cover'] },
    imageRatio: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
    onImageClick: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof Infobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Aria Voss')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('tab', { name: 'Older' }))
    await expect(canvas.getByText('Aria after the Sundering')).toBeInTheDocument()
  },
}

export const AccentColor: Story = {
  args: { accentColor: '#7c3aed' },
}

export const TransparentAccent: Story = {
  args: { accentColor: '#ffffff00' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Aria Voss')).toBeInTheDocument()
  },
}

export const SectionTabs: Story = {
  args: { data: sectionTabsData },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Abilities' }))
    await expect(canvas.getByText('Twin sabers')).toBeInTheDocument()
  },
}

export const ImageFitContain: Story = {
  args: { imageFit: 'contain', imageRatio: 1 },
}

export const ClickableImage: Story = {
  args: { onImageClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Aria as a young woman' }))
    await expect(args.onImageClick).toHaveBeenCalledWith(expect.objectContaining({ tab: 'Young' }), 0)
  },
}
