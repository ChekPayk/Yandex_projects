import { configureStore } from '@reduxjs/toolkit'
import requestsSlice from './requestsSlice'
import favoritesReducer from './favoritesSlice'
import authReducer from '@/features/auth/model/AuthSlice'
import registrationReducer from '@/features/auth/model/RegistrationSlice'
import userSkillReducer from './userSkillSlice'

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    requests: requestsSlice,
    auth: authReducer,
    registration: registrationReducer,
    userSkill: userSkillReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
