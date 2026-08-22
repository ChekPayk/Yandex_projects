import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { Skill } from '@/shared/types'

export interface UserSkillState {
  skill: Skill | null
  categoryName: string
  domainName: string
}

function loadUserSkillFromStorage(): Omit<UserSkillState, 'skill'> {
  try {
    const str = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILL)
    if (!str) {
      return { categoryName: '', domainName: '' }
    }
    return JSON.parse(str)
  } catch {
    return { categoryName: '', domainName: '' }
  }
}

function saveUserSkillToStorage(data: Omit<UserSkillState, 'skill'>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SKILL, JSON.stringify(data))
  } catch (e) {
    console.error(e)
  }
}

const initialData = loadUserSkillFromStorage()

const initialState: UserSkillState = {
  skill: null,
  categoryName: initialData.categoryName,
  domainName: initialData.domainName,
}

const userSkillSlice = createSlice({
  name: 'userSkill',
  initialState,
  reducers: {
    setUserSkill: {
      reducer(state, action: PayloadAction<{ skill: Skill; categoryName: string; domainName: string }>) {
        state.skill = action.payload.skill
        state.categoryName = action.payload.categoryName
        state.domainName = action.payload.domainName
        saveUserSkillToStorage({
          categoryName: action.payload.categoryName,
          domainName: action.payload.domainName,
        })
      },
      prepare(skill: Skill, categoryName: string, domainName: string) {
        return {
          payload: { skill, categoryName, domainName },
        }
      },
    },
    clearUserSkill: (state) => {
      state.skill = null
      state.categoryName = ''
      state.domainName = ''
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SKILL)
    },
  },
})

export const { setUserSkill, clearUserSkill } = userSkillSlice.actions
export default userSkillSlice.reducer
export const selectUserSkill = (state: { userSkill: UserSkillState }) => state.userSkill.skill
export const selectUserSkillCategory = (state: { userSkill: UserSkillState }) => state.userSkill.categoryName
export const selectUserSkillDomain = (state: { userSkill: UserSkillState }) => state.userSkill.domainName
