import styles from './CardUser.module.css'
import { IconButton } from '@/shared/ui/IconAction'
import LikeIcon from '../../shared/ui/Icons/LikeIcon'
import { UserIcon } from '../../shared/ui/UserIcon/UserIcon'
import { useMemo } from 'react'
import { Button } from '@/shared/ui/Button'
import {
  getYearDeclension,
  getSkillCategoryBySkillName,
  getCategoryByCategoryName,
} from '../../shared/lib/helpers'
import { Tag } from '@/shared/ui/Tag'
import { ClockIcon } from '@/shared/ui/Icons'
import { SkillDomain } from '@/shared/types'

export type CardUserProps = {
  avatarUrl: string | null
  name: string
  location: string
  age: number
  skillCan: string
  skillWant: string[]
  domains: SkillDomain[]
  bio?: string                    // описание пользователя
  isLiked?: boolean
  onLikeClick?: () => void        // если нет — лайк не рендерится
  onDetailsClick?: () => void     // если нет — кнопка не рендерится
  isOfferSent?: boolean           // меняет кнопку на "Обмен предложен"
}

export function CardUser({
  avatarUrl,
  name,
  location,
  age, // Для возраста есть функция getAge в helpers.ts, которая преобразует birthday в возраст, пропс возраста ожидает извне age = getAge(user.birthday)
  skillCan, // Работает также как и для возраста, ожидает пропс извне skillCan = getSkillName(user.idSkill), где getSkillName - функция из helpers.ts
  skillWant, // Работает также как и для возраста, ожидает пропс извне skillWant = getCategoryNames(user.favoriteCategories), где getCategoryNames - функция из helpers.ts
  domains,
  bio,
  isLiked,
  onLikeClick,
  onDetailsClick,
  isOfferSent,
}: CardUserProps) {
  // Элемент отвечает за количество видимых навыков
  const visibleSkills = useMemo(() => {
    if (skillWant.length === 0) return []

    const avgCharWidth = 7.33
    const totalPadding = 24
    const gap = 4
    const containerWidth = 284

    const maxElements = skillWant.length >= 2 ? 2 : skillWant.length

    if (maxElements === 2) {
      const totalChars = skillWant[0].length + skillWant[1].length
      const estimatedWidth = totalChars * avgCharWidth + totalPadding + gap

      if (estimatedWidth > containerWidth) {
        return [skillWant[0]]
      }
    }

    return skillWant.slice(0, maxElements)
  }, [skillWant])

  const hiddenCount = skillWant.length - visibleSkills.length
  const showMoreText = hiddenCount === 0 ? null : `+${hiddenCount}`

  return (
    <article className={`${styles.userCard}`}>
      <div className={styles.userCard__info}>
        {onLikeClick && (
          <IconButton
            className={styles.iconLike}
            icon={<LikeIcon active={isLiked} />}
            ariaLabel="Лайк"
            onClick={onLikeClick}
          />
        )}
        <div className={styles.userCard__avatarWrapper}>
          <UserIcon avatarUrl={avatarUrl} name={name} className={styles.userCard__avatar} />
        </div>
        <div className={styles.userCard__text}>
          <h3 className={styles.userCard__name}>{name}</h3>
          <p className={styles.userCard__textStyle}>
            {location}, {age} {getYearDeclension(age)}
          </p>
        </div>
      </div>
      {bio && <p className={styles.userCard__bio}>{bio}</p>}
      <div className={styles.userCard__skills}>
        <div className={styles.userCard__skills__option}>
          <h4 className={styles.userCard__skill__heading}>Может научить:</h4>
          <ul className={styles.userCard__skill__list}>
            <li className={`${styles.userCard__skill__list__item} ${styles.userCard__textStyle}`}>
              <Tag category={getSkillCategoryBySkillName(domains, skillCan)}>{skillCan}</Tag>
            </li>
          </ul>
        </div>
        <div className={styles.userCard__skills__option}>
          <h4 className={styles.userCard__skill__heading}>Хочет научиться:</h4>
          <ul className={styles.userCard__skill__list}>
            {visibleSkills.map((skill) => (
              <li
                className={`${styles.userCard__skill__list__item} ${styles.userCard__textStyle}`}
                key={skill}
              >
                <Tag category={getCategoryByCategoryName(skill)}>{skill}</Tag>
              </li>
            ))}
            {showMoreText && (
              <li className={`${styles.userCard__skill__list__item} ${styles.userCard__textStyle}`}>
                <Tag category={'plus'}>{showMoreText}</Tag>
              </li>
            )}
          </ul>
        </div>
        {onDetailsClick && !isOfferSent && (
          <Button
            className={styles.userCardButton}
            onClick={onDetailsClick}
            variant="primary"
          >
            Подробнее
          </Button>
        )}
        {isOfferSent && (
          <Button
            className={styles.userCardButton}
            variant="secondary"
            icon={<ClockIcon />}
            iconPosition="before"
          >
            Обмен предложен
          </Button>
        )}
      </div>
    </article>
  )
}

export default CardUser
