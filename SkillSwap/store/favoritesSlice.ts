import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export interface FavoritesState {
  favoriteUserIds: string[]
}

function loadFavoritesFromStorage(): string[] {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)
    return rawData ? (JSON.parse(rawData) as string[]) : []
  } catch {
    return []
  }
}

function saveFavoritesToStorage(favoriteUserIds: string[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteUserIds))
}

const initialState: FavoritesState = {
  favoriteUserIds: loadFavoritesFromStorage(),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      const index = state.favoriteUserIds.indexOf(userId)

      if (index === -1) {
        state.favoriteUserIds.push(userId)
      } else {
        state.favoriteUserIds.splice(index, 1)
      }

      saveFavoritesToStorage(state.favoriteUserIds)
    },
  },
})

export const { toggleLike } = favoritesSlice.actions

export const selectFavoriteUserIds = (state: { favorites: FavoritesState }) =>
  state.favorites.favoriteUserIds

export default favoritesSlice.reducer
