/** Валидация email */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/** Валидация пароля (минимум 8 символов) */
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

/** Валидация имени (минимум 2 символа) */
export function isValidFullName(fullName: string): boolean {
  return fullName.trim().length >= 2
}

/** Валидация даты рождения */
export function isValidBirthday(birthday: string): boolean {
  if (!birthday) return false

  const birthDate = new Date(birthday)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Дата не должна быть в будущем
  return birthDate <= today
}

/** Валидация названия навыка (3-50 символов) */
export function isValidSkillName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 3 && trimmed.length <= 50
}

/** Валидация описания (до 500 символов) */
export function isValidDescription(description: string): boolean {
  return description.length <= 500
}

/** Валидация изображения (≤2MB, jpeg/png) */
export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ['image/jpeg', 'image/png']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Только форматы JPEG и PNG' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Размер файла не должен превышать 2MB' }
  }

  return { valid: true }
}

/** Проверка заполненности строкового поля */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
