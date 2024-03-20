import CloseIcon from 'public/close.svg'

import { Image } from './image'

type Props = {
  img: Blob | MediaSource
  onClear: () => void
}

export const ImgPreview = ({ img, onClear }: Props) => {
  return (
    <div className='relative h-28 w-28 shadow'>
      <Image
        className='overflow-hidden object-contain'
        src={URL.createObjectURL(img)}
        alt='Picked image'
        fill
      />
      <div
        className='absolute right-1 top-1 cursor-pointer bg-sky text-sm text-pure'
        onClick={onClear}
      >
        <CloseIcon />
      </div>
    </div>
  )
}
