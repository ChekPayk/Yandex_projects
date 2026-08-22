import { ActiveFiltersBarProps } from './types'
import styles from './ActiveFiltersBar.module.css'
import cities from '../../../public/db/cities.json'
import skills from '../../../public/db/skills.json'
import { CrossIcon } from '../../shared/ui/Icons'

export const ActiveFiltersBar = ({ filters, onReset, onRemoveFilter }: ActiveFiltersBarProps) => {
  const count =
    filters.categories.length +
    filters.cities.length +
    Number(filters.type !== 'all') +
    Number(filters.sex !== 'any')

  return (
    <div className={styles.filterBar}>
      <p className={styles.filtersParagraph}>{count > 0 ? `Фильтры (${count})` : 'Фильтры'}</p>

      {count > 0 && (
        <>
          <span className={styles.resetSpan} onClick={onReset}>
            Сбросить <CrossIcon />
          </span>

          {filters.type !== 'all' && (
            <div className={styles.filetsActive}>
              <span>{filters.type === 'want' ? 'Хочу научиться' : 'Могу научить'}</span>
              <span onClick={() => onRemoveFilter('type', filters.type)}>
                <CrossIcon />
              </span>
            </div>
          )}

          {filters.sex !== 'any' && (
            <div className={styles.filetsActive}>
              <span>{filters.sex === 'male' ? 'Мужской' : 'Женский'}</span>
              <span onClick={() => onRemoveFilter('sex', filters.sex)}>
                <CrossIcon />
              </span>
            </div>
          )}

          {filters.categories.map((catId) => {
            const category = skills.skillDomains
              .flatMap((d) => d.categories)
              .find((c) => c.id === catId)
            return category ? (
              <div key={catId} className={styles.filetsActive}>
                <span>{category.name}</span>
                <span onClick={() => onRemoveFilter('categories', catId)}>
                  <CrossIcon />
                </span>
              </div>
            ) : null
          })}

          {filters.cities.map((cityId) => {
            const city = cities.find((c) => c.id === cityId)
            return city ? (
              <div key={cityId} className={styles.filetsActive}>
                <span>{city.name}</span>
                <span onClick={() => onRemoveFilter('cities', cityId)}>
                  <CrossIcon />
                </span>
              </div>
            ) : null
          })}
        </>
      )}
    </div>
  )
}
