import { create } from 'zustand'

import { CategoryType } from '../api/suggestions'

type Store = {
  chosen: CategoryType[]
  setChosen: (category: CategoryType[]) => void
}

export const useStore = create<Store>((set) => ({
  chosen: [],
  setChosen: (category) => set(() => ({ chosen: [...category] })),
}))
