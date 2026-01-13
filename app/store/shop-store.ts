import { apiClient } from '@/lib/axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreAddress {
  id: number
  name?: string
  address: string
  ward: string
  district: string
  city: string
  mapUrl: string
  phoneNumbers: string[]
}

export interface Store {
  facebookUrl: string
  youtubeUrl: string
  instagramUrl: string
  addresses: StoreAddress[]
}

export interface ShopStore {
  // State
  store: Store
  loading: boolean
  error: string | null

  // Actions
  fetchStore: () => Promise<void>
  clearError: () => void
  reset: () => void

  // Internal helpers
  _setStore: (store: Store) => void
  _setLoading: (loading: boolean) => void
  _setError: (error: string | null) => void
}

export const useShopStore = create<ShopStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      store: null,
      loading: false,
      error: null,

      // Internal helper to set store data
      _setStore: (storeData) => {
        set({ store: storeData })
      },

      // Internal helper to set loading state
      _setLoading: (loading) => {
        set({ loading })
      },

      // Internal helper to set error state
      _setError: (error) => {
        set({ error })
      },

      // Fetch store data from API
      fetchStore: async () => {
        const { _setStore, _setLoading, _setError } = get()

        _setLoading(true)
        _setError(null)

        try {
          const response = await apiClient.get('/global')
          if (response.status === 200) {
            const storeData = response.data as Store
            let storeAddresses = storeData.addresses
            storeAddresses = storeAddresses.map((address, index) => {
              return {
                ...address,
                name: `Cửa hàng ${index + 1}`,
              }
            })
            _setStore({ ...storeData, addresses: storeAddresses })
          } else {
            throw new Error('Failed to fetch store data')
          }
        } catch (error: any) {
          console.error('Error fetching store data:', error)
          _setError(error.response?.data?.message || error.message || 'Failed to fetch store data')
        } finally {
          _setLoading(false)
        }
      },

      // Clear error state
      clearError: () => {
        set({ error: null })
      },

      // Reset store to initial state
      reset: () => {
        set({
          loading: false,
          error: null,
        })
      },
    }),
    {
      name: 'shop-store',
    },
  ),
)

// Selectors for easy access to specific data
export const useStoreAddresses = () => useShopStore((state) => state.store?.addresses || [])
export const useStoreSocialLinks = () =>
  useShopStore((state) => ({
    facebook: state.store?.facebookUrl,
    youtube: state.store?.youtubeUrl,
    instagram: state.store?.instagramUrl,
  }))
export const useStoreLoading = () => useShopStore((state) => state.loading)
export const useStoreError = () => useShopStore((state) => state.error)
