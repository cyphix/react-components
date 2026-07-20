import { Infobox, type InfoboxData } from '@/registry/infobox/infobox'
import { StateGrid } from '@/internal/state-grid'

function svgImage(label: string, background: string, width: number, height: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="${Math.round(width / 10)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const characterData: InfoboxData = {
  title: 'Aria Voss',
  subtitle: 'The Wandering Blade',
  images: [
    {
      src: svgImage('Young', '#475569', 300, 400),
      alt: 'Aria as a young woman',
      tab: 'Young',
      caption: 'Aria during the Academy years',
    },
    {
      src: svgImage('Older', '#334155', 300, 400),
      alt: 'Aria in her later years',
      tab: 'Older',
      caption: 'Aria after the Sundering',
    },
  ],
  sections: [
    {
      title: 'Biographical information',
      rows: [
        { label: 'Born', value: '3rd Age, 412' },
        { label: 'Homeland', value: { label: 'Ashenfall', href: '#ashenfall' } },
        { label: 'Age', value: 34 },
      ],
    },
    {
      title: 'Affiliations',
      rows: [
        {
          label: 'Factions',
          value: [
            { label: 'Silver Order', href: '#silver-order' },
            'Free Blades',
          ],
        },
        { label: 'Titles', value: ['Knight-Errant', 'Warden of the East'] },
      ],
    },
  ],
}

const simpleData: InfoboxData = {
  title: 'Ashenfall',
  sections: [
    {
      rows: [
        { label: 'Type', value: 'City-state' },
        { label: 'Population', value: '~120,000' },
        { label: 'Ruler', value: { label: 'Council of Nine', href: '#council' } },
      ],
    },
  ],
}

const wideImageData: InfoboxData = {
  title: 'The Sundering',
  images: [
    {
      src: svgImage('Wide panorama', '#0f766e', 800, 300),
      alt: 'A wide panorama of the Sundering',
    },
  ],
  sections: [
    {
      rows: [
        { label: 'Date', value: '3rd Age, 440' },
        { label: 'Location', value: 'Eastern Reaches' },
      ],
    },
  ],
}

export function InfoboxShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default (theme colors, image tabs)',
          node: <Infobox data={characterData} />,
        },
        {
          label: 'accent color override',
          node: <Infobox data={characterData} accentColor="#7c3aed" />,
        },
        {
          label: 'no image',
          node: <Infobox data={simpleData} />,
        },
        {
          label: 'imageFit: cover (crop, default)',
          node: <Infobox data={wideImageData} imageFit="cover" />,
        },
        {
          label: 'imageFit: contain (scale to fit)',
          node: <Infobox data={wideImageData} imageFit="contain" />,
        },
        {
          label: 'square image box (imageRatio: 1)',
          node: <Infobox data={wideImageData} imageRatio={1} imageFit="contain" />,
        },
      ]}
    />
  )
}
