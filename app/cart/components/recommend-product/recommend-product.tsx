import { ProductCard } from '@/app/components/products/product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ISimpleProduct } from '@/lib/types/product'

type RelatedProductRowType = {
  products: Array<ISimpleProduct>
  dark?: boolean
}
export const RelatedProductRow = ({ products, dark }: RelatedProductRowType) => (
  <Carousel className='w-full' opts={{ align: 'start', loop: true }}>
    <CarouselContent className='ml-0'>
      {products.map((product: ISimpleProduct) => (
        <CarouselItem
          key={`carousel-item-${product.slug}-${product.id}`}
          className='not-last:pl-0 lg:not-last:pl-2 pl-0 basis-1/2 lg:basis-1/3 xl:basis-1/4'
        >
          <ProductCard hit={product} showVariant={false} showProductName={true} dark={dark} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className='disabled:hidden sm:flex lg:top-3/8 top-2/7 lg:size-10 lg:left-8 left-1 bg-atomic-tangerine-300 border-atomic-tangerine-500/30 text-gray-800 hover:bg-atomic-tangerine-300' />
    <CarouselNext className='disabled:hidden sm:flex lg:top-3/8 top-2/7 lg:size-10 lg:right-8 right-1 bg-atomic-tangerine-300 border-atomic-tangerine-500/30 text-gray-800 hover:bg-atomic-tangerine-300' />
  </Carousel>
)
