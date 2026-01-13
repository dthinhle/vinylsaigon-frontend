'use client'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IProductImage } from '@/lib/types/product'
import { blurImageDataUrl, cn, toBase64 } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon, Cross2Icon } from '@radix-ui/react-icons'
import 'inner-image-zoom/lib/styles.min.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom'

interface Props {
  images: IProductImage[]
  productName?: string
}

const MAX_IMAGES = 4

const ProductImages: React.FC<Props> = ({ images, productName }) => {
  const displayImages = images?.slice(0, MAX_IMAGES)
  const [api, setApi] = useState<CarouselApi>()
  const [fullscreenApi, setFullscreenApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [currentFullscreen, setCurrentFullscreen] = useState(0)

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!fullscreenApi) return

    fullscreenApi.on('select', () => {
      setCurrentFullscreen(fullscreenApi.selectedScrollSnap())
    })
  }, [fullscreenApi])

  if (!displayImages) {
    return <></>
  }

  const previewColumnClass =
    displayImages.length === 1
      ? 'lg:grid-cols-1'
      : 'lg:grid-cols-2 [&_.zoom-img>div]:h-full [&_img:first-child]:h-full! [&_img:first-child]:object-cover'

  return (
    <>
      <div className='hidden md:block'>
        <div className={cn(previewColumnClass, 'grid grid-cols-1 gap-4 2xl:gap-6 overflow-hidden')}>
          {displayImages.map((image, index) => (
            <InnerImageZoom
              key={index}
              src={image.url}
              className='object-contain zoom-img'
              zoomType='hover'
              zoomPreload={false}
              hasSpacer
              imgAttributes={{
                height: 'auto',
                width: '100%',
              }}
              hideHint={true}
              fadeDuration={0}
            />
          ))}
        </div>
        {images.length > MAX_IMAGES && (
          <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
            <DialogTrigger asChild>
              <p className='text-center mt-4 h-6'>
                <span className='pb-3 border-b cursor-pointer font-bold text-base hover:text-lg transition-all'>
                  Xem thêm hình ảnh
                </span>
              </p>
            </DialogTrigger>
            <DialogContent className='h-screen w-screen max-w-none! max-h-none p-0 bg-white/95 backdrop-blur-sm border-none [&>button]:hidden'>
              <DialogTitle className='sr-only'>Product Images Fullscreen</DialogTitle>
              <div className='relative w-full h-full flex items-center'>
                <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-black rounded-full px-3 py-1 text-md'>
                  <span className='text-white'>{currentFullscreen + 1}</span>
                  <span className='text-gray-400'>/{images.length}</span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute left-4 z-10 cursor-pointer bg-black/50 text-white hover:bg-black/70 hover:text-white h-12 w-12 rounded-full ml-4'
                  onClick={() => fullscreenApi?.scrollPrev()}
                >
                  <ChevronLeftIcon className='size-6' />
                </Button>
                <div className='w-full px-16'>
                  <Carousel
                    setApi={setFullscreenApi}
                    opts={{
                      loop: true,
                      align: 'start',
                    }}
                    className='w-full h-full'
                  >
                    <CarouselContent className='-ml-4'>
                      {images.map((image, index) => (
                        <CarouselItem key={index} className='pl-2 lg:basis-1/3 md:basis-1/2'>
                          <div className='relative w-full h-[80vh]'>
                            <Image
                              src={image.url}
                              alt={
                                productName
                                  ? `${productName} - Ảnh ${index + 1}`
                                  : `Ảnh sản phẩm ${index + 1}`
                              }
                              fill
                              className='object-contain'
                              unoptimized
                              loading='lazy'
                              blurDataURL={`data:image/svg+xml;base64,${toBase64( blurImageDataUrl(800, 800) )}`}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-4 z-10 cursor-pointer bg-black/50 text-white hover:bg-black/70 hover:text-white h-12 w-12 rounded-full mr-4'
                  onClick={() => fullscreenApi?.scrollNext()}
                >
                  <ChevronRightIcon className='size-6' />
                </Button>
                <DialogClose asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 cursor-pointer bg-black/50 text-white hover:bg-black/70 hover:text-white h-16 w-16 rounded-full'
                    onClick={() => setFullscreenOpen(false)}
                  >
                    <Cross2Icon className='size-8' />
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className='block md:hidden relative'>
        <Carousel setApi={setApi} opts={{ loop: true }} className='w-full'>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className='aspect-product-image relative'>
                  <Image
                    src={image.url}
                    alt={
                      productName
                        ? `${productName} - Ảnh ${index + 1}`
                        : `Ảnh sản phẩm ${index + 1}`
                    }
                    fill
                    className='object-contain'
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className='absolute top-4 right-4 bg-black rounded-full px-3 py-1 text-xs'>
          <span className='text-white'>{current + 1}</span>
          <span className='text-gray-400'>/{images.length}</span>
        </div>
      </div>
    </>
  )
}

export default ProductImages
