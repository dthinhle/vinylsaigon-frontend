import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'

type ListProductLoadingProps = {
  search?: boolean
}

export const ListProductLoading = ({ search }: ListProductLoadingProps) => (<>
  {search && (
    <div className='max-w-md md:mx-auto mx-4 mb-4'>
      <Skeleton className='h-12 w-full bg-gray-200' />
    </div>
  )}
  <div className='filter-wrapper'>
    <div className='flex lg:flex-row flex-col items-center justify-between lg:border-t lg:border-b lg:py-3 lg:px-1.5 border-gray-300'>
      <div className='flex lg:flex-row flex-col justify-start items-center lg:space-x-4 w-full lg:py-0 p-3'>
        <Skeleton className='h-8 w-full lg:w-40 bg-gray-200' />
      </div>
      <div className='lg:w-1/6 w-full lg:border-b-0 border-b border-gray-300 lg:py-0 p-3 order-first lg:order-last '>
        <div className="dropdown-wrapper flex flex-row items-center">
          <Skeleton className='h-8 w-full lg:w-42 bg-gray-200' />
          <ChevronDownIcon
            className='size-5 ml-2 animate-pulse text-gray-200'
            aria-hidden='true'
          />
        </div>
      </div>
    </div>
    <div className='result-wrapper lg:mx-4 mt-2 lg:min-h-240'>
      <ul className={cn('ais-InfiniteHits-list grid lg:grid-cols-4 grid-cols-2')}>
        <>
          {[...new Array(8)].map((_, index) => (
            <li key={`skeleton-${index}`} className='p-4'>
              <Skeleton className='ais-InfiniteHits-item lg:h-96 h-72 w-full bg-gray-200' />
            </li>
          ))}
        </>
      </ul>
    </div>
  </div>
</>
)
