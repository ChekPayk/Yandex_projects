import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer, { toggleLike, selectFavoriteUserIds } from './favoritesSlice'

const createStore = () => configureStore({
  reducer: { favorites: favoritesReducer }
})

describe('favoritesSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('начальное состояние пустое', () => {
    const store = createStore()
    expect(selectFavoriteUserIds(store.getState())).toEqual([])
  })

  it('toggleLike добавляет id, если его нет', () => {
    const store = createStore()
    store.dispatch(toggleLike('1'))
    expect(selectFavoriteUserIds(store.getState())).toContain('1')
  })

  it('toggleLike убирает id, если он уже есть', () => {
    const store = createStore()
    store.dispatch(toggleLike('1'))
    store.dispatch(toggleLike('1'))
    expect(selectFavoriteUserIds(store.getState())).not.toContain('1')
  })

  it('можно лайкнуть нескольких пользователей', () => {
    const store = createStore()
    store.dispatch(toggleLike('1'))
    store.dispatch(toggleLike('2'))
    store.dispatch(toggleLike('3'))
    expect(selectFavoriteUserIds(store.getState())).toEqual(['1', '2', '3'])
  })

  it('сохраняет лайки в localStorage', () => {
    const store = createStore()
    store.dispatch(toggleLike('1'))
    const saved = JSON.parse(localStorage.getItem('skillswap_favorites') ?? '[]')
    expect(saved).toContain('1')
  })
})
