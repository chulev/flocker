'use client'

import BaseImage, { type ImageProps } from 'next/image'

const toBase64 = (str: string) => Buffer.from(str).toString('base64')

const SHIMMER = `
<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5096f1" />
      <stop offset="100%" stop-color="#1371f1" />
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite" />
      <animate attributeName="y1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
      <animate attributeName="x2" values="100%;0%;100%" dur="4s" repeatCount="indefinite" />
      <animate attributeName="y2" values="100%;0%;100%" dur="3s" repeatCount="indefinite" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#blueGradient)" />
</svg>`

const PLACEHOLDER: `data:image/${string}` = `data:image/svg+xml;base64,${toBase64(SHIMMER)}`

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
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/v${src}`
}

export const Image = ({ src, alt, ...rest }: ImageProps) => (
  <BaseImage
    loader={isCloudinarySrc(src as string) ? cloudinaryLoader : undefined}
    sizes='(max-width: 640px) 50vw, (min-width: 640px) 20vw'
    placeholder={PLACEHOLDER}
    src={src}
    alt={alt}
    {...rest}
  />
)
