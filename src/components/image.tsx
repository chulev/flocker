'use client'

import BaseImage, { ImageProps } from 'next/image'

const isCloudinarySrc = (src: string) => !src.includes('https')

const cloudinaryLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')]
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/v${src}`
}

export const Image = ({ src, alt, ...rest }: ImageProps) => (
  <BaseImage
    loader={isCloudinarySrc(src as string) ? cloudinaryLoader : undefined}
    sizes='(max-width: 640px) 50vw, (min-width: 640px) 20vw'
    src={src}
    alt={alt}
    {...rest}
  />
)
