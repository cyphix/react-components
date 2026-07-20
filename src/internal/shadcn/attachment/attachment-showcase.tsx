import { FileTextIcon, ImageIcon, TriangleAlertIcon, XIcon } from 'lucide-react'

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment'
import { Spinner } from '@/components/ui/spinner'

export function AttachmentShowcase() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          file attachment
        </span>
        <Attachment>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove attachment">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          states
        </span>
        <div className="flex flex-wrap gap-3">
          <Attachment state="idle">
            <AttachmentMedia>
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>photo.png</AttachmentTitle>
              <AttachmentDescription>Waiting</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="uploading">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>photo.png</AttachmentTitle>
              <AttachmentDescription>Uploading…</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="error">
            <AttachmentMedia>
              <TriangleAlertIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>photo.png</AttachmentTitle>
              <AttachmentDescription>Upload failed</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          sizes
        </span>
        <div className="flex flex-wrap items-start gap-3">
          <Attachment size="default">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>default.txt</AttachmentTitle>
              <AttachmentDescription>4 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment size="sm">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>small.txt</AttachmentTitle>
              <AttachmentDescription>4 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment size="xs">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>tiny.txt</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          vertical group
        </span>
        <AttachmentGroup className="max-w-md">
          {['mockup-v1.png', 'mockup-v2.png', 'notes.md'].map((name) => (
            <Attachment key={name} orientation="vertical">
              <AttachmentMedia>
                {name.endsWith('.png') ? <ImageIcon /> : <FileTextIcon />}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${name}`}>
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      </div>
    </div>
  )
}
