'use client'

import BaseImage, { ImageProps } from 'next/image'

export const Image = ({ src, alt, ...rest }: ImageProps) => (
  <BaseImage src={src} alt={alt} {...rest} />
)
