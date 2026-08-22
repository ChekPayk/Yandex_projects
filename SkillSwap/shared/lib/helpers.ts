import type { Skill, SkillCategory, SkillDomain } from '@/shared/types'
import type { TagProps } from '../ui/Tag'
import type { User, FiltersState } from '../types'

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Получает возраст, используя дату рождения */
export function getAge(birthday: string): number {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/** Склоняет слово "год" в зависимости от возраста */
export function getYearDeclension(age: number): string {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'лет'
  }

  switch (lastDigit) {
    case 1:
      return 'год'
    case 2:
    case 3:
    case 4:
      return 'года'
    default:
      return 'лет'
  }
}

// Преобразование скиллов в категории
const categoryMap: Record<string, TagProps['category']> = {
  Фотография: 'art',
  'Музыка и звук': 'art',
  Дизайн: 'art',
  Рукоделие: 'art',

  'Иностранные языки': 'languages',
  'Программирование и IT': 'plus',
  'Логика и критическое мышление': 'education',
  'Публичные выступления': 'education',

  'Йога и медитация': 'health',
  'Водные виды спорта': 'health',
  'Походы и туризм': 'health',

  Кулинария: 'home',
  Садоводство: 'home',
  'Ремонт и мастерство': 'home',

  'Маркетинг и SMM': 'business',
  'Тайм-менеджмент': 'business',

  'Ролевые игры и фэнтези': 'plus',
}

export function getCategoryByCategoryName(categoryName: string): TagProps['category'] {
  return categoryMap[categoryName] || 'plus'
}

export function getSkillCategoryBySkillName(
  domains: SkillDomain[],
  skillName: string,
): TagProps['category'] {
  const domain = domains.find((d) =>
    d.categories.some((cat) => cat.skills.some((skill) => skill.name === skillName)),
  )

  const category = domain?.categories.find((cat) =>
    cat.skills.some((skill) => skill.name === skillName),
  )?.name

  return categoryMap[category || ''] || 'plus'
}

export function getSkillsFromDomains(domains: SkillDomain[]): Skill[] {
  return domains.flatMap((d) => d.categories.flatMap((cat) => cat.skills))
}

export function getCategoriesFromDomains(domains: SkillDomain[]): SkillCategory[] {
  return domains.flatMap((d) => d.categories)
}

export function getSkillName(skills: Skill[], skillId: string): string {
  return skills.find((s) => s.id === skillId)?.name || 'Нет данных'
}

export function getCategoryNames(categories: SkillCategory[], categoryIds: string[]): string[] {
  return categoryIds.map((id) => {
    const cat = categories.find((c) => c.id === id)
    return cat?.name || 'Нет данных'
  })
}

/** Проверяет, есть ли активные фильтры (отличные от значений по умолчанию) */
export function hasActiveFilters(filters: FiltersState): boolean {
  return (
    filters.type !== 'all' ||
    filters.sex !== 'any' ||
    filters.categories.length > 0 ||
    filters.cities.length > 0
  )
}

/**
 * Фильтрует массив пользователей по всем заданным критериям одновременно.
 */
export function filterUsers(
  users: User[],
  filters: FiltersState,
  domains: SkillDomain[],
  cityIdToName?: Map<string, string>,
): User[] {
  return users.filter((user: User) => {
    // 1. Фильтр по типу навыка
    if (filters.type !== 'all') {
      const userHasSkill = domains.some((domain: SkillDomain) =>
        domain.categories.some((category) =>
          category.skills.some((skill) => skill.id === user.idSkill),
        ),
      );

      if (filters.type === 'can' && !userHasSkill) {
        return false;
      }

      if (filters.type === 'want') {
        const userWantsSkill = user.favoriteCategories.some((catId: string) =>
          domains.some((domain: SkillDomain) =>
            domain.categories.some((category) => category.id === catId),
          ),
        );
        if (!userWantsSkill) {
          return false;
        }
      }
    }

    // 2. Фильтр по полу
    if (filters.sex !== 'any' && user.sex !== filters.sex) {
      return false;
    }

    // 3. Фильтр по категориям навыков
    if (filters.categories.length > 0) {
      const hasMatchingCategory = user.favoriteCategories.some((catId: string) =>
        filters.categories.includes(catId),
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    // 4. Фильтр по городам — преобразуем id в название
    if (filters.cities.length > 0 && cityIdToName) {
      const cityNames = filters.cities
        .map((id: string) => cityIdToName.get(id))
        .filter(Boolean);
      if (!cityNames.includes(user.location)) {
        return false;
      }
    }

    return true;
  });
}
