import { API_QUERY_URL } from '@/lib/constants'
import {
  OverridableMeiliSearchSearchParameters,
  instantMeiliSearch,
} from '@meilisearch/instant-meilisearch'
import { SearchClient, UiState } from 'instantsearch.js'
import { compact } from 'lodash'

const DEFAULT_SORT = 'products:updatedAt:desc'

/**
 * Search route state interface for all products page
 */
interface SearchRouteState {
  brands?: string
  collections?: string
  flags?: string
  categories?: string
  sortBy?: string
  [key: string]: string | undefined
}

/**
 * Configuration for creating customized search clients
 */
interface SearchClientConfig {
  url?: string
  apiKey?: string
  primaryKey?: string
  keepZeroFacets?: boolean
  placeholderSearch?: boolean
  meiliSearchParams?: OverridableMeiliSearchSearchParameters & { filter?: string }
}

const parseQuotedString = (str: unknown): string[] => {
  if (typeof str !== 'string') return []
  try {
    return str.match(/"([^"]*)"/g)?.map((m) => m.slice(1, -1)) || []
  } catch {
    return []
  }
}

const arrayToQuotedString = (arr?: string[]): string | undefined => {
  return arr?.map((item) => `"${item}"`)?.join(',') || undefined
}

// Type definitions
interface ProductState {
  query?: string
  sortBy?: string
  refinementList?: {
    brands?: string[]
    collections?: string[]
    flags?: string[]
  }
  hierarchicalMenu?: {
    'categories.lv0'?: string[]
    'categories.lv1'?: string[]
  }
}

interface SearchState {
  products: ProductState
  [key: string]: any
}

/**
 * State mapping for all products page - includes all filters
 */
export const baseStateMapping = {
  cleanUrlOnDispose: true,
  stateToRoute(uiState: UiState): SearchRouteState {
    const indexUiState = uiState.products
    if (!indexUiState) return {}

    const result: SearchRouteState = {
      sortBy: indexUiState.sortBy !== DEFAULT_SORT ? indexUiState.sortBy : undefined,
    }

    // Include all refinement lists
    if ('brands' in (indexUiState.refinementList || {})) {
      result.brands = arrayToQuotedString(indexUiState.refinementList?.brands)
    }
    if ('collections' in (indexUiState.refinementList || {})) {
      result.collections = arrayToQuotedString(indexUiState.refinementList?.collections)
    }
    if ('flags' in (indexUiState.refinementList || {})) {
      result.flags = arrayToQuotedString(indexUiState.refinementList?.flags)
    }

    if ((indexUiState.hierarchicalMenu?.['categories.lv1'] || []).length > 0) {
      const categories = indexUiState.hierarchicalMenu?.['categories.lv1'][0].split(' > ') || []
      result.categories = arrayToQuotedString(categories)
    } else if ((indexUiState.hierarchicalMenu?.['categories.lv0'] || []).length > 0) {
      const categories = indexUiState.hierarchicalMenu?.['categories.lv0'] || []
      result.categories = arrayToQuotedString(categories)
    }

    if (indexUiState.query) {
      result.query = indexUiState.query
    }

    return result
  },

  routeToState(routeState: Record<string, unknown>): SearchState {
    if (Object.keys(routeState).length === 0) {
      return { products: { sortBy: DEFAULT_SORT } }
    }

    const sortBy = typeof routeState.sortBy === 'string' ? routeState.sortBy : DEFAULT_SORT
    const result: SearchState = {
      products: {
        sortBy,
      },
    }

    const brands = parseQuotedString(routeState.brands)
    if (brands.length > 0) {
      result.products.refinementList = {
        ...result.products.refinementList,
        brands,
      }
    }
    const collections = parseQuotedString(routeState.collections)
    if (collections.length > 0) {
      result.products.refinementList = {
        ...result.products.refinementList,
        collections,
      }
    }
    const flags = parseQuotedString(routeState.flags)
    if (flags.length > 0) {
      result.products.refinementList = {
        ...result.products.refinementList,
        flags,
      }
    }
    const [category, subCategory] = parseQuotedString(routeState.categories)

    if (category || subCategory) {
      result.products.hierarchicalMenu = {
        'categories.lv0': compact([category, subCategory]),
      }
    }

    if (routeState.query && typeof routeState.query === 'string') {
      result.products.query = routeState.query
    }

    return result
  },
}

/**
 * Creates a customized search client with optional filters
 */
export const createSearchClient = (config: SearchClientConfig = {}) => {
  const {
    url = API_QUERY_URL,
    apiKey = '',
    primaryKey = 'id',
    keepZeroFacets = false,
    placeholderSearch = true,
    meiliSearchParams = {},
  } = config
  return instantMeiliSearch(url, apiKey, {
    primaryKey,
    keepZeroFacets,
    placeholderSearch,
    meiliSearchParams,
  })
}

// Convenience functions for backward compatibility
export const searchStateMapping = baseStateMapping

// Default search client
export const { searchClient } = createSearchClient()

export const searchConfig = (client?: ReturnType<typeof instantMeiliSearch>['searchClient']) => ({
  indexName: 'products',
  searchClient: (client || searchClient) as unknown as SearchClient,
})

// Default search config for convenience
export const defaultSearchConfig = searchConfig()

export const sortOptions = [
  { value: 'products:updatedAt:desc', label: 'Mới nhất' },
  { value: 'products:updatedAt:asc', label: 'Cũ nhất' },
  { value: 'products:currentPrice:asc', label: 'Giá thấp đến cao' },
  { value: 'products:currentPrice:desc', label: 'Giá cao đến thấp' },
]
