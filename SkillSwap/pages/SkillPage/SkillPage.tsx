import { Header } from '@/widgets/header'
import { CardUser } from '@/widgets/CardUser'
import { useNavigate, useParams } from 'react-router-dom'
import users from '../../../public/db/users.json'
import skills from '../../../public/db/skills.json'
import { getAge, getCategoryNames, getSkillName } from '@/shared/lib/helpers.ts'
import { useMemo } from 'react'
import { CardSkill } from '@/widgets/CardSkill'
import { CardSlider } from '@/widgets/CardSlider'
import { User } from '@/shared/types'
import { Footer } from '@/widgets/Footer'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleLike, selectFavoriteUserIds } from '@/store/favoritesSlice'
import styles from './SkillPage.module.css'

const allCategories = skills.skillDomains.flatMap((domain) => domain.categories)
const allSkills = allCategories.flatMap((category) => category.skills)

export default function SkillPage() {
  const dispatch = useAppDispatch()
  const likedUserIds = useAppSelector(selectFavoriteUserIds)
  const { id } = useParams()
  const navigate = useNavigate()
  const user = users.find((u) => u.id === id)
  const favoriteDomains = useMemo(() => {
    if (!user || !user.favoriteCategories) return []
    return skills.skillDomains
      .map((domain) => ({
        ...domain,
        categories: domain.categories.filter((category) =>
          user.favoriteCategories.includes(category.id),
        ),
      }))
      .filter((domain) => domain.categories.length > 0)
  }, [user])

  const currentSkill = useMemo(() => {
    if (!user) return null
    return allSkills.find((s) => s.id === user.idSkill)
  }, [user])

  const skillMeta = useMemo(() => {
    if (!currentSkill) return { domainName: 'Нет данных', categoryName: 'Нет данных' }
    let domainName = 'Нет данных'
    let categoryName = 'Нет данных'
    for (const domain of skills.skillDomains) {
      for (const cat of domain.categories) {
        if (cat.skills.some((s) => s.id === currentSkill.id)) {
          domainName = domain.name
          categoryName = cat.name
          break
        }
      }
    }
    return { domainName, categoryName }
  }, [currentSkill])

  const similarUsers = useMemo(() => {
    if (!user) return []

    let currentDomainId: string | null = null

    for (const domain of skills.skillDomains) {
      const hasSkill = domain.categories.some((cat) =>
        cat.skills.some((s) => s.id === user.idSkill),
      )
      if (hasSkill) {
        currentDomainId = domain.id
        break
      }
    }

    const allUsers = users as User[]

    let filteredUsers = allUsers.filter((u) => {
      if (u.id === user.id) return false

      return skills.skillDomains
        .find((d) => d.id === currentDomainId)
        ?.categories.some((cat) => cat.skills.some((s) => s.id === u.idSkill))
    })

    if (filteredUsers.length === 0) {
      filteredUsers = allUsers.filter(
        (u) =>
          u.id !== user.id &&
          u.favoriteCategories.some((cat) => user.favoriteCategories.includes(cat)),
      )
    }
    return filteredUsers
  }, [user])

  if (!user) {
    return null
  }

  const age = getAge(user.birthday)
  const skillCan = getSkillName(allSkills, user.idSkill)
  const skillWant = getCategoryNames(allCategories, user.favoriteCategories)

  const handleLikeClick = (userId: string) => {
    dispatch(toggleLike(userId))
  }

  return (
    <section className={styles.skillPage}>
      <Header />
      <div className={styles.userSection}>
        <CardUser
          avatarUrl={user.avatarUrl}
          name={user.fullName}
          location={user.location}
          age={age}
          skillCan={skillCan}
          skillWant={skillWant}
          domains={favoriteDomains}
          bio={user.bio}
        ></CardUser>
        <CardSkill
          pageVariant="home"
          title={skillCan}
          skillId={currentSkill?.id}
          domain={skillMeta.domainName}
          category={skillMeta.categoryName}
          description={currentSkill?.description ?? 'Описание отсутствует'}
          images={currentSkill?.skillImages ?? []}
          isLiked={likedUserIds.includes(user.id)}
          onLikeClick={() => handleLikeClick(user.id)}
        />
      </div>
      <div className={styles.sliderWrapper}>
        <CardSlider
          onLikeClick={handleLikeClick}
          likedUserIds={likedUserIds}
          onDetailsClick={(userId) => {
            navigate(`/skill/${userId}`)
          }}
          title="Похожие предложения"
          users={similarUsers}
          domains={skills.skillDomains}
        />
      </div>
      <div className={styles.footerWrapper}>
        <Footer />
      </div>
    </section>
  )
}
