import { ofetch } from 'ofetch'
import { useComponentsConfig } from '../config'
import type { ReuseType } from '../types/reuses'

let reuseTypesRequest: Array<ReuseType> | null = null

export async function fetchReuseTypes() {
  if (reuseTypesRequest) {
    return reuseTypesRequest
  }
  const config = useComponentsConfig()
  reuseTypesRequest = await ofetch<Array<ReuseType>>('api/1/reuses/types/', {
    baseURL: config.apiBase,
  })
  return reuseTypesRequest
}

export function getType(types: Array<ReuseType>, id: string): string {
  const type = types.find(t => t.id === id)
  return type ? type.label : ''
}
