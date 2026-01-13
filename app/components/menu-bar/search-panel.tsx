'use client'

import { montserrat } from '@/app/fonts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { API_QUERY_URL, DEFAULT_VARIANT_NAME, FRONTEND_PATH } from '@/lib/constants'
import { cn, formatPrice } from '@/lib/utils'
import { ProductAdapter } from '@/lib/utils/product'
import LogoBlack from '@/public/assets/logo-black.svg'
import Logo from '@/public/assets/logo.svg'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { SearchClient } from 'instantsearch.js'
import { debounce, sampleSize } from 'lodash'
import { LoaderCircle, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import {
  Highlight,
  Index,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch'

import { ArticleHit, ProductHit } from '../products/static-list-product'
import { CategoryItem, CollectionItem, ISearchSuggestions, ProductItem } from './menu-data'

interface ISearchPanelProps {
  isOpen: boolean
  closeSearch: () => void
  searchSuggestions: ISearchSuggestions
}

interface IDefaultSearchPanel {
  searchSuggestions: ISearchSuggestions
}

const createCustomSearchClient = (baseClient: any) => ({
  ...baseClient,
  search: (requests: any[]) => {
    // Check if any request has a query shorter than 2 characters
    const hasShortQuery = requests.some(
      (request) => request.params?.query && request.params.query.length < 2,
    )

    if (hasShortQuery) {
      // Return empty results without making the actual search request
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 20,
          facets: {},
          exhaustiveFacetsCount: true,
          exhaustiveNbHits: true,
          query: requests[0]?.params?.query || '',
          params: '',
          processingTimeMS: 0,
        })),
      })
    }

    return baseClient.search(requests)
  },
})

const baseSearchClient = instantMeiliSearch(API_QUERY_URL, '', {
  primaryKey: 'id',
})

const searchClient = createCustomSearchClient(baseSearchClient.searchClient)

const ProductResultHit = ({ hit }: { hit: ProductHit }) => {
  const product = React.useMemo(() => ProductAdapter.fromHit(hit), [hit])
  const productImage = product.getSearchResultImage() ?? LogoBlack.src
  const { displayPrice } = product.getDefaultPriceInfo()
  const cheapestVariant = product.getCheapestVariant()
  const productUrl = product.variants.length > 1 && cheapestVariant && cheapestVariant.name !== DEFAULT_VARIANT_NAME && cheapestVariant.slug !== product.variants[0].slug
    ? `${FRONTEND_PATH.productDetail(product.slug)}?variant=${cheapestVariant.slug}`
    : FRONTEND_PATH.productDetail(product.slug)

  return (
    <Link key={`product-${product.id}`} href={productUrl}>
      <div className='flex items-center gap-4 p-2 hover:bg-gray-100'>
        <div className='size-16 overflow-hidden rounded place-items-center flex bg-white p-2'>
          <Image src={productImage} alt={product.name} width={64} height={64} className='aspect-square object-cover' unoptimized />
        </div>
        <div className='w-full'>
          <div className='font-medium [&_.ais-Highlight-highlighted]:bg-sea-buckthorn-400 [&_.ais-Highlight-highlighted]:rounded-xs [&_.ais-Highlight-highlighted]:px-px'>
            <Highlight attribute='name' hit={hit} />
          </div>
          <div className='text-sm text-gray-500'>
            {displayPrice ? formatPrice(displayPrice) : 'Liên hệ'}
          </div>
        </div>
      </div>
    </Link>
  )
}

const ArticleResultHit = ({ hit }: { hit: ArticleHit }) => {
  return (
    <Link key={`article-${hit.id}`} href={FRONTEND_PATH.newsDetail(hit.slug)}>
      <div className='flex items-center gap-4 p-2 hover:bg-gray-100'>
        <div className='size-16 overflow-hidden rounded place-items-center flex bg-white p-2'>
          <Image src={hit.featuredImageUrl ? hit.featuredImageUrl : LogoBlack.src} alt={hit.title} width={64} height={64} className='aspect-square object-cover' unoptimized />
        </div>
        <div className='w-full'>
          <div className='font-medium [&_.ais-Highlight-highlighted]:bg-sea-buckthorn-400 [&_.ais-Highlight-highlighted]:rounded-xs [&_.ais-Highlight-highlighted]:px-px'>
            <Highlight attribute='title' classNames={{ root: 'line-clamp-1' }} hit={hit} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function CustomHits<T extends ProductHit | ArticleHit>({
  hitComponent: Hit,
  indexName,
}: {
  hitComponent: React.ComponentType<{ hit: T }>
  indexName: string
}) {
  const { results } = useHits<T>()

  if (results && results.query.length >= 2 && results.nbHits === 0) {
    return (
      <div className='lg:p-7 md:text-base text-sm text-center text-gray-500'>
        <p>
          Không tìm thấy kết quả cho &quot;{results.query}&quot; trong {indexName}.
        </p>
      </div>
    )
  }

  return (
    <div>
      {results?.hits.map((hit) => (
        <Hit key={hit.objectID} hit={hit} />
      ))}
    </div>
  )
}

const transformSearchSuggestions = (
  data: ProductItem | CategoryItem | CollectionItem,
): { label: string; path: string } | null => {
  switch (data.type) {
    case 'product':
      return { label: data.name, path: FRONTEND_PATH.productDetail(data.slug) }
    case 'category':
      return { label: data.title, path: FRONTEND_PATH.productCategory(data.slug) }
    case 'collection':
      return { label: data.name, path: FRONTEND_PATH.collectionDetail(data.slug) }
    default:
      return null
  }
}

const SearchSuggestionSection = ({
  title,
  items,
}: {
  title: string
  items: { label: string; path: string }[]
}) => (
  <div className='mb-6'>
    <h3 className={cn(montserrat.className, 'font-bold text-gray-900 mb-4')}>{title}</h3>
    <div className='flex flex-wrap gap-2'>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.path}
          className='px-3 py-1.5 border border-gray-300 rounded-full text-sm hover:bg-gray-100'
        >
          {item.label}
        </a>
      ))}
    </div>
  </div>
)

const DefaultSearchContent = ({ searchSuggestions }: IDefaultSearchPanel) => {
  const popularSearches = searchSuggestions.popularSearches
    .map((item) => transformSearchSuggestions(item))
    .filter((item): item is { label: string; path: string } => item !== null)
  const forYouContent = searchSuggestions.forYouContent
    .map((item) => transformSearchSuggestions(item))
    .filter((item): item is { label: string; path: string } => item !== null)
  const helpfulShortcuts = React.useMemo(() => sampleSize(
    [
      { label: 'Liên hệ', path: FRONTEND_PATH.contact },
      { label: 'Giới thiệu', path: FRONTEND_PATH.aboutUs },
      { label: 'Cam kết hàng hóa', path: FRONTEND_PATH.guarantee },
      { label: 'Bảo mật thông tin cá nhân', path: FRONTEND_PATH.privacyPolicy },
      { label: 'Hình thức thanh toán', path: FRONTEND_PATH.paymentMethods },
      { label: 'Hướng dẫn mua trả góp', path: FRONTEND_PATH.installmentGuide },
    ],
    5,
  ), [])

  return (
    <div className='mt-2'>
      <SearchSuggestionSection title='Tìm kiếm phổ biến' items={popularSearches} />
      <SearchSuggestionSection title='Dành riêng cho bạn' items={forYouContent} />
      <SearchSuggestionSection title='Hướng dẫn hữu ích' items={helpfulShortcuts} />
    </div>
  )
}

const SearchResults = ({ searchSuggestions }: IDefaultSearchPanel) => {
  const { indexUiState, status } = useInstantSearch()
  const query = indexUiState.query || ''

  if (query.length < 2) {
    return (
      <>
        {query.length > 0 && (
          <p className='text-sm/5 text-sea-buckthorn-400 ml-2 mb-2'>
            Vui lòng nhập từ khoá ít nhất 2 ký tự.
          </p>
        )}
        <DefaultSearchContent searchSuggestions={searchSuggestions} />
      </>
    )
  }

  return (
    <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 lg:max-h-unset max-h-[calc(100dvh-20rem)]'>
      <div
        data-status={status}
        className='data-[status=idle]:hidden data-[status=error]:hidden text-center col-span-2 text-gray-500 py-10'
      >
        <div className='loading-wrapper flex flex-row items-center justify-center gap-2'>
          <LoaderCircle className='size-6 animate-spin' />
          Đang tải kết quả...
        </div>
      </div>
      <div
        data-status={status}
        className='data-[status=loading]:hidden data-[status=stalled]:hidden'
      >
        <h3 className={cn(montserrat.className, 'font-bold text-gray-900 mb-4')}>Sản phẩm</h3>
        <Index indexName='products_search'>
          <CustomHits<ProductHit> hitComponent={ProductResultHit} indexName='sản phẩm' />
        </Index>
      </div>
      <div
        data-status={status}
        className='data-[status=loading]:hidden data-[status=stalled]:hidden'
      >
        <h3 className={cn(montserrat.className, 'font-bold text-gray-900 mb-4')}>Bài viết</h3>
        <Index indexName='articles'>
          <CustomHits<ArticleHit> hitComponent={ArticleResultHit} indexName='bài viết' />
        </Index>
      </div>
    </div>
  )
}

const DebouncedSearchBox = ({
  panelOpen,
  closeSearch,
}: {
  panelOpen: boolean
  closeSearch: () => void
}) => {
  const { query, refine, clear } = useSearchBox({})
  const [inputValue, setInputValue] = React.useState(query)
  const inputField = React.useRef<HTMLInputElement>(null)
  const debouncedRefine = React.useRef(debounce((value: string) => refine(value), 300))

  React.useEffect(() => {
    setInputValue(query)
  }, [query])

  React.useEffect(() => {
    if (panelOpen) inputField.current?.focus()
  }, [panelOpen])

  React.useEffect(() => {
    const debouncedRefineInstance = debouncedRefine.current
    return () => {
      debouncedRefineInstance.cancel()
    }
  }, [])

  const handleClear = () => {
    setInputValue('')
    clear()
    inputField.current?.focus()
  }

  const handleSearchClick = () => {
    clear()
    closeSearch()

    window.location.href = FRONTEND_PATH.searchResult(inputValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim().length < 2) return
    handleSearchClick()
  }

  return (
    <form onSubmit={handleSubmit} className='flex'>
      <div className='search-wrapper w-full relative'>
        <Input
          value={inputValue}
          ref={inputField}
          onChange={(event) => {
            const value = event.currentTarget.value
            setInputValue(value)
            debouncedRefine.current(value)
          }}
          placeholder='Tìm kiếm…'
          className='w-full p-2 border border-gray-300 focus-visible:ring-[1px] focus-visible:ring-gray-300'
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          onClick={handleClear}
          disabled={!inputValue.length}
        >
          <XIcon className='h-4 w-4' />
          <span className='sr-only'>Clear</span>
        </Button>
      </div>
      <Button
        variant='outline'
        type='submit'
        className='ml-4 focus-visible:ring-[1.5px] focus-visible:ring-gray-300'
      >
        Tìm kiếm
      </Button>
    </form>
  )
}

const SearchPanel = ({ isOpen, searchSuggestions, closeSearch }: ISearchPanelProps) => {
  return (
    <div className='w-full lg:min-h-144 lg:max-h-[max(calc(100dvh-16rem),36rem)] flex flex-col'>
      <InstantSearch
        future={{
          preserveSharedStateOnUnmount: false,
        }}
        searchClient={searchClient as unknown as SearchClient}
      >
        <div className='search-content-wrapper p-6 pb-0'>
          <DebouncedSearchBox panelOpen={isOpen} closeSearch={closeSearch} />
        </div>
        <div className='search-results-wrapper p-6 pt-2 grow overflow-y-auto'>
          <SearchResults searchSuggestions={searchSuggestions} />
        </div>
      </InstantSearch>
      <Separator />
      <div className='p-6 '>
        <Image src={Logo} alt='Logo 3K Shop - Trang tìm kiếm' width={48} height={48} unoptimized />
      </div>
    </div>
  )
}

export default SearchPanel
