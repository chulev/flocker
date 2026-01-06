'use client'

import UploadIcon from 'public/upload.svg'
import { forwardRef } from 'react'

import { useCopyRef } from '@/hooks/use-copy-ref'
import { ACCEPTED_IMAGE_MIME_TYPES } from '@/lib/validations'

import { Button } from './button'

type Props = React.ComponentPropsWithRef<'input'> & {
  label?: string
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ImgPicker = forwardRef<HTMLInputElement, Props>(
  ({ label, onImageSelect, ...rest }, ref) => {
    const copyRef = useCopyRef<HTMLInputElement>(ref)

    return (
      <>
        {/* biome-ignore lint: hidden input for upload */}
        <input
          {...rest}
          className='hidden'
          ref={copyRef}
          type='file'
          accept={ACCEPTED_IMAGE_MIME_TYPES.join(', ')}
          role='button'
          aria-label='Pick an image'
          onInput={onImageSelect}
        />
        <Button
          variant='highlight'
          onClick={() => copyRef?.current.click()}
          aria-label='Upload image'
        >
          <UploadIcon />
          {label && <span className='ml-2'>{label}</span>}
        </Button>
      </>
    )
  }
)

ImgPicker.displayName = 'ImgPicker'
