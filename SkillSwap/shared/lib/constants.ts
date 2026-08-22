export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_USER: '/register/user',
  REG_SKILL: '/register/skill',
  ABOUT: '/about',
} as const

export const SKILL_CATEGORIES = [
  'Программирование',
  'Дизайн',
  'Языки',
  'Музыка',
  'Спорт',
  'Кулинария',
  'Фото и видео',
  'Бизнес',
  'Другое',
] as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
  REGISTRATION_DATA: 'skillswap_registration_data',
  JWT_TOKEN: 'skillswap_jwt_token',
  USER_AVATAR: 'skillswap_user_avatar',
  USER_SKILL: 'skillswap_user_skill',
} as const

