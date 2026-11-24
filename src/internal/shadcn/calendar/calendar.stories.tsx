import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

function CalendarShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [range, setRange] = useState<DateRange | undefined>()

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          single
        </span>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          range
        </span>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          className="rounded-lg border"
        />
      </div>
    </div>
  )
}

const meta = {
  title: 'Shadcn/Calendar',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <CalendarShowcase />,
}
