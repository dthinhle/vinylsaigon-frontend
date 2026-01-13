'use client'

import { Index, MeiliSearch } from 'meilisearch'

import { API_QUERY_URL } from './constants'

class MeilisearchClient {
  private static instance: MeilisearchClient
  private client: MeiliSearch

  private constructor() {
    const host = API_QUERY_URL

    if (!host) {
      throw new Error('API_QUERY_URL is not defined')
    }

    this.client = new MeiliSearch({ host })
  }

  public static getInstance(): MeilisearchClient {
    if (!MeilisearchClient.instance) {
      MeilisearchClient.instance = new MeilisearchClient()
    }

    return MeilisearchClient.instance
  }

  public getIndex(index: string): Index {
    return this.client.index(index)
  }
}

export const meilisearchClient = MeilisearchClient.getInstance()
