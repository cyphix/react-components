import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { UploadProgress } from '@/registry/upload-progress/upload-progress'

type DemoUpload =
  | { state: 'idle' | 'complete' | 'error' }
  | { state: 'processing'; percent?: number }
  | { state: 'uploading'; percent: number }

export function UploadProgressShowcase() {
  const [upload, setUpload] = useState<DemoUpload>({ state: 'idle' })
  const start = () => setUpload({ state: 'uploading', percent: 0 })

  useEffect(() => {
    if (upload.state === 'uploading') {
      const percent = upload.percent + 20
      const timer = setTimeout(() => {
        setUpload(percent >= 100 ? { state: 'processing' } : { state: 'uploading', percent })
      }, 250)
      return () => clearTimeout(timer)
    }

    if (upload.state === 'processing') {
      const timer = setTimeout(() => {
        setUpload(upload.percent === undefined
          ? { state: 'processing', percent: 50 }
          : { state: 'complete' })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [upload])

  return (
    <div className="grid max-w-lg gap-3">
      <Button
        type="button"
        className="justify-self-start"
        disabled={upload.state === 'uploading' || upload.state === 'processing'}
        onClick={start}
      >
        Simulate upload
      </Button>
      {upload.state !== 'idle' && (
        <UploadProgress
          fileName="photo.png"
          state={upload.state}
          uploadPercent={upload.state === 'uploading' ? upload.percent : undefined}
          processingPercent={upload.state === 'processing' ? upload.percent : undefined}
          errorMessage="Upload canceled."
          onCancel={() => setUpload({ state: 'error' })}
          onRetry={start}
        />
      )}
      <UploadProgress fileName="scan.pdf" state="uploading" />
    </div>
  )
}
