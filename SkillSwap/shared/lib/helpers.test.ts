import { describe, it, expect } from 'vitest'
import { getAge, getYearDeclension, getSkillName, getCategoryNames } from './helpers'

describe('getAge', () => {
  it('возвращает возраст', () => {
    expect(getAge('2000-01-01')).toBe(new Date().getFullYear() - 2000)
  })

  it('учитывает неполный год', () => {
    const lastYear = new Date().getFullYear() - 1
    expect(getAge(`${lastYear}-12-31`)).toBe(0)
  })
})

describe('getYearDeclension', () => {
  it('возвращает "год" для 1, 21, 31', () => {
    expect(getYearDeclension(1)).toBe('год')
    expect(getYearDeclension(21)).toBe('год')
    expect(getYearDeclension(31)).toBe('год')
  })

  it('возвращает "года" для 2, 3, 4', () => {
    expect(getYearDeclension(2)).toBe('года')
    expect(getYearDeclension(3)).toBe('года')
    expect(getYearDeclension(4)).toBe('года')
  })

  it('возвращает "лет" для 5, 11, 19, 20', () => {
    expect(getYearDeclension(5)).toBe('лет')
    expect(getYearDeclension(11)).toBe('лет')
    expect(getYearDeclension(19)).toBe('лет')
    expect(getYearDeclension(20)).toBe('лет')
  })
})

describe('getSkillName', () => {
  const skills = [
    {id: '100', name: 'Тайм-менеджмент', description: '', skillImages: [], authorId: '1', likedByUserIds: [] },
    { id: '101', name: 'Наставничество в IT', description: '', skillImages: [], authorId: '2', likedByUserIds: [] },
  ]

  it('возвращает название навыка по id', () => {
    expect(getSkillName(skills, '100')).toBe('Тайм-менеджмент')
  })

  it('возвращает "Нет данных", если навык не найден', () => {
    expect(getSkillName(skills, '200')).toBe('Нет данных')
  })
})

describe('getCategoryNames', () => {
  const categories = [
    { id: '10', name: 'Фотография', skills: [] },
    { id: '11', name: 'Музыка и звук', skills: [] },
  ]

  it('возвращает массив названий категорий', () => {
    expect(getCategoryNames(categories, ['10', '11'])).toEqual(['Фотография', 'Музыка и звук'])
  })

  it('возвращает "Нет данных" для ненайденного id', () => {
    expect(getCategoryNames(categories, ['20'])).toEqual(['Нет данных'])
  })

  it('возвращает пустой массив если ids пустой', () => {
    expect(getCategoryNames(categories, [])).toEqual([])
  })
})
