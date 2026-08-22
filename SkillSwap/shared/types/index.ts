// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  name: string
  description: string
  skillImages: string[]
  authorId: string
  likedByUserIds: string[]
}

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

export interface SkillDomain {
  id: string
  name: string
  categories: SkillCategory[]
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string
  fullName: string
  email: string
  password: string
  avatarUrl: string | null
  createdAt: string
  sex: 'male' | 'female' | 'not_specified'
  birthday: string
  location: string
  bio: string
  idSkill: string
  favoriteCategories: string[]
  role: 'user' | 'admin'
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
  avatarUrl: string | null
}

/** Тип для состояния фильтров */
export type FiltersState = {
  type: 'all' | 'want' | 'can'
  sex: 'any' | 'male' | 'female'
  categories: string[]
  cities: string[]
}
