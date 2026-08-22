import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSkillDomains } from '@/api/skills'
import type { SkillDomain } from '@/shared/types'
import citiesData from '../../../public/db/cities.json'
import { Header } from '@/widgets/header'
import { StepIndicator } from '@/shared/ui/StepIndicator'
import { RegUserForm } from '@/widgets/RegUserForm'
import { IllustratedGuide } from '@/widgets/IllustratedGuide'
import { UserInfo } from '@/shared/ui/Illustrations'
import {
  setStep2Data,
  setCurrentStep,
  selectStep1Data,
  selectStep2Data,
} from '@/features/auth/model/RegistrationSlice'
import { ROUTES } from '@/shared/lib/constants'
import { isValidFullName, isValidBirthday } from '@/shared/lib/validation'
import styles from './RegUserPage.module.css'

const sexOptions = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' }
]

const cityOptions = citiesData.map((city) => ({
  value: city.id,
  label: city.name,
}))

export const RegUserPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const step1Data = useSelector(selectStep1Data)
  const prevStep2Data = useSelector(selectStep2Data)

  const [fullName, setFullName] = useState(prevStep2Data.fullName || '')
  const [birthday, setBirthday] = useState(prevStep2Data.birthday || '')
  const [sex, setSex] = useState(prevStep2Data.sex || '')
  const [city, setCity] = useState(prevStep2Data.city || '')
  const [categoryId, setCategoryId] = useState(prevStep2Data.categoryId || '')
  const [subcategoryId, setSubcategoryId] = useState(prevStep2Data.subcategoryId || '')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [skillDomains, setSkillDomains] = useState<SkillDomain[]>([])

  const [errors, setErrors] = useState<{
    fullName?: string
    birthday?: string
    sex?: string
    city?: string
    categoryId?: string
    subcategoryId?: string
    avatar?: string
  }>({})

  useEffect(() => {
    if (!step1Data.email || !step1Data.password) {
      navigate(ROUTES.REGISTER)
      return
    }

    fetchSkillDomains()
      .then(setSkillDomains)
      .catch((err) => console.error('Failed to load skill domains:', err))
  }, [step1Data.email, step1Data.password, navigate])

  const categoryOptions = useMemo(() => {
    return skillDomains.map((domain) => ({
      value: domain.id,
      label: domain.name,
    }))
  }, [skillDomains])

  const subcategoryOptions = useMemo(() => {
    if (!categoryId) return []
    const selectedDomain = skillDomains.find((d) => d.id === categoryId)
    if (!selectedDomain?.categories) return []

    return selectedDomain.categories.map((category) => ({
      value: category.id,
      label: category.name,
    }))
  }, [categoryId, skillDomains])

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId)
    setSubcategoryId('')
    setErrors((prev) => ({ ...prev, subcategoryId: undefined }))
  }

  const validateForm = () => {
    const newErrors: {
      fullName?: string
      birthday?: string
      sex?: string
      city?: string
      categoryId?: string
      subcategoryId?: string
      avatar?: string
    } = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Введите имя'
    } else if (!isValidFullName(fullName)) {
      newErrors.fullName = 'Имя должно содержать минимум 2 символа'
    }

    if (!birthday) {
      newErrors.birthday = 'Выберите дату рождения'
    } else if (!isValidBirthday(birthday)) {
      newErrors.birthday = 'Дата не может быть в будущем'
    }

    if (!sex) {
      newErrors.sex = 'Выберите пол'
    }

    if (!city) {
      newErrors.city = 'Выберите город'
    }

    if (!categoryId) {
      newErrors.categoryId = 'Выберите категорию'
    }

    if (!subcategoryId) {
      newErrors.subcategoryId = 'Выберите подкатегорию'
    }

    // Валидация аватарки (опционально, но если выбрана — проверяем формат)
    if (avatar) {
      const allowedTypes = ['image/jpeg', 'image/png']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!allowedTypes.includes(avatar.type)) {
        newErrors.avatar = 'Только форматы JPEG и PNG'
      }

      if (avatar.size > maxSize) {
        newErrors.avatar = 'Размер файла не должен превышать 2MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    dispatch(
      setStep2Data({
        fullName,
        birthday,
        sex,
        city,
        categoryId,
        subcategoryId,
        avatar,
      }),
    )
    dispatch(setCurrentStep(3))
    navigate(ROUTES.REG_SKILL)
  }

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file)
    // Очищаем ошибку аватарки при изменении
    if (errors.avatar) {
      setErrors((prev) => ({ ...prev, avatar: undefined }))
    }
  }

  const handleBack = () => {
    navigate(ROUTES.REGISTER)
  }

  return (
    <div className={styles.page}>
      <Header isAuthPage={true} />

      <main className={styles.content}>
        <StepIndicator currentStep={2} totalSteps={3} />
        <div className={styles.columns}>
          <div className={styles.column}>
            <RegUserForm
              fullName={fullName}
              birthday={birthday}
              sex={sex}
              city={city}
              categoryId={categoryId}
              subcategoryId={subcategoryId}
              avatar={avatar}
              onChangeFullName={setFullName}
              onChangeBirthday={setBirthday}
              onChangeSex={setSex}
              onChangeCity={setCity}
              onChangeCategoryId={handleCategoryChange}
              onChangeSubcategoryId={setSubcategoryId}
              onChangeAvatar={handleAvatarChange}
              sexOptions={sexOptions}
              cityOptions={cityOptions}
              categoryOptions={categoryOptions}
              subcategoryOptions={subcategoryOptions}
              errors={errors}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </div>

          <div className={styles.column}>
            <IllustratedGuide
              ImageComponent={UserInfo}
              title="Расскажите немного о себе"
              description="Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default RegUserPage
