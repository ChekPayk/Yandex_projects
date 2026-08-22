import styles from './SidebarPanel.module.css'
import { Radio } from '../../shared/ui/Radio'
import { CheckboxCategoryIcon, CheckboxSubcategoryIcon } from '@/shared/ui/Icons'
import { VuesaxIcon } from '@/shared/ui/Icons'
import { useState, Fragment } from 'react'
import { ChevronUpIcon } from '../../shared/ui/Icons'
import { ChevronDownIcon } from '../../shared/ui/Icons'
import cities from '../../../public/db/cities.json'
import skills from '../../../public/db/skills.json'
import { SidebarPanelProps } from './types'

export const SidebarPanel = ({ filters, onChange }: SidebarPanelProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [active, setActive] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)

  const toggle = (id: string) => {
    const newSet = new Set(expandedCategories)
    if (!newSet.has(id)) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setExpandedCategories(newSet)
  }

  return (
    <div className={styles.panel}>
      <section className={styles.types}>
        <Radio
          label="Всё"
          name="type"
          value="all"
          icon={
            <VuesaxIcon
              active={filters.type === 'all'}
              color={filters.type === 'all' ? '#ABD27A' : '#253017'}
            />
          }
          checked={filters.type === 'all'}
          onChange={() => onChange({ ...filters, type: 'all' })}
        />
        <Radio
          label="Хочу научиться"
          name="type"
          value="want"
          icon={
            <VuesaxIcon
              active={filters.type === 'want'}
              color={filters.type === 'want' ? '#ABD27A' : '#253017'}
            />
          }
          checked={filters.type === 'want'}
          onChange={() => onChange({ ...filters, type: 'want' })}
        />
        <Radio
          label="Могу научить"
          name="type"
          value="can"
          icon={
            <VuesaxIcon
              active={filters.type === 'can'}
              color={filters.type === 'can' ? '#ABD27A' : '#253017'}
            />
          }
          checked={filters.type === 'can'}
          onChange={() => onChange({ ...filters, type: 'can' })}
        />
      </section>
      <section className={styles.skills}>
        <p>Навыки</p>
        {skills.skillDomains
          .slice(0, showAllSkills ? skills.skillDomains.length : 5)
          .map((skill) => {
            const isExpanded = expandedCategories.has(skill.id)
            return (
              <Fragment key={skill.id}>
                <div className={styles.skillsContainer} onClick={() => toggle(skill.id)}>
                  <CheckboxCategoryIcon
                    active={isExpanded}
                    color={isExpanded ? '#ABD27A' : '#253017'}
                  />
                  <span>{skill.name}</span>
                  {isExpanded && <ChevronUpIcon />}
                </div>
                {isExpanded && (
                  <div className={styles.subCategoryList}>
                    {skill.categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={styles.subCategoryItem}
                        onClick={() => {
                          const isSelected = filters.categories.includes(cat.id)
                          const newCategories = isSelected
                            ? filters.categories.filter((id) => id !== cat.id)
                            : [...filters.categories, cat.id]
                          onChange({ ...filters, categories: newCategories })
                        }}
                      >
                        <CheckboxSubcategoryIcon
                          active={filters.categories.includes(cat.id)}
                          color={isExpanded ? '#ABD27A' : '#253017'}
                        />
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Fragment>
            )
          })}
        <div className={styles.allSkills} onClick={() => setShowAllSkills(!showAllSkills)}>
          <span className={styles.allTypes}>Все категории</span>
          {showAllSkills ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </section>
      <section className={styles.gender}>
        <div className={styles.genderContainer}>
          <p>Пол автора</p>
          <Radio
            label="Не имеет значения"
            name="sex"
            value="any"
            icon={
              <VuesaxIcon
                active={filters.sex === 'any'}
                color={filters.sex === 'any' ? '#ABD27A' : '#253017'}
              />
            }
            checked={filters.sex === 'any'}
            onChange={() => onChange({ ...filters, sex: 'any' })}
          />
          <Radio
            label="Мужской"
            name="sex"
            value="male"
            icon={
              <VuesaxIcon
                active={filters.sex === 'male'}
                color={filters.sex === 'male' ? '#ABD27A' : '#253017'}
              />
            }
            checked={filters.sex === 'male'}
            onChange={() => onChange({ ...filters, sex: 'male' })}
          />
          <Radio
            label="Женский"
            name="sex"
            value="female"
            icon={
              <VuesaxIcon
                active={filters.sex === 'female'}
                color={filters.sex === 'female' ? '#ABD27A' : '#253017'}
              />
            }
            checked={filters.sex === 'female'}
            onChange={() => onChange({ ...filters, sex: 'female' })}
          />
        </div>
      </section>
      <section className={styles.citysSection}>
        <div className={styles.cityContaier}>
          <p>Город</p>
          {cities.slice(0, active ? cities.length : 5).map((city) => (
            <div
              key={city.id}
              className={styles.citys}
              onClick={() => {
                const isSelected = filters.cities.includes(city.id)
                const newCities = isSelected
                  ? filters.cities.filter((id) => id !== city.id)
                  : [...filters.cities, city.id]
                onChange({ ...filters, cities: newCities })
              }}
            >
              <CheckboxCategoryIcon
                active={filters.cities.includes(city.id)}
                color={filters.cities.includes(city.id) ? '#ABD27A' : '#253017'}
              />
              <span>{city.name}</span>
            </div>
          ))}
          <div className={styles.allCitys} onClick={() => setActive(!active)}>
            <span className={styles.allTypes}>Все города</span>
            {active ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
        </div>
      </section>
    </div>
  )
}
