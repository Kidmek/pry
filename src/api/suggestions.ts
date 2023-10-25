import { URL } from '../constants'

export interface CategoryType {
  name: string
  category: string
  value: number
  id: string
}

type Params = {
  queryKey: [string, { query: string }]
}
export async function fetchCategories(params: Params) {
  const [, { query }] = params.queryKey
  const response = await fetch(URL)

  const json = await response.json()
  const categories = (json || []).filter((category: CategoryType) =>
    category.category.startsWith(query)
  )
  return categories
}
