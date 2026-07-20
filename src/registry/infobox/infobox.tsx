import * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type InfoboxLink = { label: string; href: string }

type InfoboxValue = string | number | InfoboxLink | Array<string | InfoboxLink>

type InfoboxRow = { label: string; value: InfoboxValue }

type InfoboxSection = {
  title?: string
  /**
   * Label of the tab the section is grouped under. Sections without a tab
   * always render above the tab bar; if fewer than two distinct tab labels
   * exist, everything renders inline as if no tabs were set.
   */
  tab?: string
  rows: InfoboxRow[]
}

type InfoboxImage = {
  src: string
  alt?: string
  /** Label of the tab shown above the image when several images are provided. */
  tab?: string
  caption?: string
}

type InfoboxData = {
  title: string
  subtitle?: string
  images?: InfoboxImage[]
  sections: InfoboxSection[]
}

type InfoboxImageFit = "contain" | "cover"

type InfoboxProps = React.ComponentProps<typeof Card> & {
  data: InfoboxData
  /**
   * Optional accent color (any CSS color) for the title and section headers.
   * When omitted, the theme's default colors are used. The paired text color
   * can be overridden through the `--infobox-accent-foreground` CSS variable.
   */
  accentColor?: string
  /**
   * "contain" scales the image until its width or height hits the image box;
   * "cover" crops the image to fill the box.
   */
  imageFit?: InfoboxImageFit
  /** Aspect ratio (width / height) of the image box. */
  imageRatio?: number
}

function isInfoboxLink(value: unknown): value is InfoboxLink {
  return typeof value === "object" && value !== null && "href" in value
}

function InfoboxValueItem({ item }: { item: string | number | InfoboxLink }) {
  if (isInfoboxLink(item)) {
    return (
      <a
        href={item.href}
        className="text-primary underline-offset-2 hover:underline"
      >
        {item.label}
      </a>
    )
  }
  return <>{item}</>
}

function InfoboxValueContent({ value }: { value: InfoboxValue }) {
  if (Array.isArray(value)) {
    return (
      <ul className="flex flex-col gap-0.5">
        {value.map((item, index) => (
          <li key={index}>
            <InfoboxValueItem item={item} />
          </li>
        ))}
      </ul>
    )
  }
  return <InfoboxValueItem item={value} />
}

function InfoboxImageFigure({
  image,
  fit,
  ratio,
}: {
  image: InfoboxImage
  fit: InfoboxImageFit
  ratio: number
}) {
  return (
    <figure data-slot="infobox-image">
      <AspectRatio ratio={ratio} className="bg-muted">
        <img
          src={image.src}
          alt={image.alt ?? ""}
          className={cn(
            "size-full",
            fit === "contain" ? "object-contain" : "object-cover"
          )}
        />
      </AspectRatio>
      {image.caption && (
        <figcaption className="px-3 py-1.5 text-center text-xs text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

function InfoboxImages({
  images,
  fit,
  ratio,
}: {
  images: InfoboxImage[]
  fit: InfoboxImageFit
  ratio: number
}) {
  if (images.length === 0) return null
  if (images.length === 1) {
    return <InfoboxImageFigure image={images[0]} fit={fit} ratio={ratio} />
  }

  const tabValue = (image: InfoboxImage, index: number) =>
    image.tab ?? `image-${index + 1}`

  return (
    <Tabs
      data-slot="infobox-image-tabs"
      defaultValue={tabValue(images[0], 0)}
      className="gap-0"
    >
      <TabsList className="w-full rounded-none">
        {images.map((image, index) => (
          <TabsTrigger
            key={tabValue(image, index)}
            value={tabValue(image, index)}
            className="rounded-none"
          >
            {image.tab ?? `Image ${index + 1}`}
          </TabsTrigger>
        ))}
      </TabsList>
      {images.map((image, index) => (
        <TabsContent key={tabValue(image, index)} value={tabValue(image, index)}>
          <InfoboxImageFigure image={image} fit={fit} ratio={ratio} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function InfoboxSectionList({ sections }: { sections: InfoboxSection[] }) {
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section
          data-slot="infobox-section"
          key={section.title ?? sectionIndex}
        >
          {section.title ? (
            <div
              data-slot="infobox-section-title"
              className="bg-[var(--infobox-section)] px-4 py-1.5 text-center text-sm font-semibold text-[var(--infobox-section-foreground)]"
            >
              {section.title}
            </div>
          ) : (
            sectionIndex > 0 && <Separator />
          )}
          {section.rows.map((row, rowIndex) => (
            <React.Fragment key={row.label}>
              {rowIndex > 0 && <Separator />}
              <div
                data-slot="infobox-row"
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 px-4 py-2 text-sm"
              >
                <div className="font-medium">{row.label}</div>
                <div className="text-muted-foreground">
                  <InfoboxValueContent value={row.value} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </section>
      ))}
    </>
  )
}

function InfoboxSections({ sections }: { sections: InfoboxSection[] }) {
  const untabbed = sections.filter((section) => section.tab === undefined)
  const tabLabels = [
    ...new Set(
      sections.flatMap((section) =>
        section.tab === undefined ? [] : [section.tab]
      )
    ),
  ]

  // A single tab renders inline as if no tabs were set.
  if (tabLabels.length < 2) {
    return <InfoboxSectionList sections={sections} />
  }

  return (
    <>
      <InfoboxSectionList sections={untabbed} />
      <Tabs
        data-slot="infobox-section-tabs"
        defaultValue={tabLabels[0]}
        className="gap-0"
      >
        <TabsList className="w-full rounded-none">
          {tabLabels.map((label) => (
            <TabsTrigger key={label} value={label} className="rounded-none">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabLabels.map((label) => (
          <TabsContent key={label} value={label}>
            <InfoboxSectionList
              sections={sections.filter((section) => section.tab === label)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

function Infobox({
  data,
  accentColor,
  imageFit = "cover",
  imageRatio = 3 / 4,
  className,
  style,
  ...props
}: InfoboxProps) {
  // Theme colors by default; a custom accent recolors the title bar (with a
  // readable light foreground) and tints the section headers. The default
  // title bar mixes a touch of foreground into muted so it stands out from
  // section headers without leaving the theme palette.
  const colorVars = {
    "--infobox-accent":
      accentColor ?? "color-mix(in oklab, var(--muted) 88%, var(--foreground))",
    "--infobox-accent-foreground": accentColor ? "#fff" : "var(--foreground)",
    "--infobox-section": accentColor
      ? `color-mix(in oklab, ${accentColor} 15%, transparent)`
      : "var(--muted)",
    "--infobox-section-foreground": accentColor
      ? "var(--foreground)"
      : "var(--muted-foreground)",
  } as React.CSSProperties

  return (
    <Card
      data-slot="infobox"
      className={cn("w-80 max-w-full gap-0 overflow-hidden py-0", className)}
      style={{ ...colorVars, ...style }}
      {...props}
    >
      <div
        data-slot="infobox-header"
        className="bg-[var(--infobox-accent)] px-4 py-3 text-center text-[var(--infobox-accent-foreground)]"
      >
        <h3 className="text-base leading-tight font-semibold">{data.title}</h3>
        {data.subtitle && (
          <p className="mt-0.5 text-xs opacity-80">{data.subtitle}</p>
        )}
      </div>
      {data.images && (
        <InfoboxImages images={data.images} fit={imageFit} ratio={imageRatio} />
      )}
      <div data-slot="infobox-body">
        <InfoboxSections sections={data.sections} />
      </div>
    </Card>
  )
}

export { Infobox }
export type {
  InfoboxData,
  InfoboxImage,
  InfoboxImageFit,
  InfoboxLink,
  InfoboxProps,
  InfoboxRow,
  InfoboxSection,
  InfoboxValue,
}
