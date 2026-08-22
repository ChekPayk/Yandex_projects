import { Input } from '@/shared/ui/Input'
import styles from './RegUserForm.module.css'
import { CalendarIcon, CrossIcon } from '@/shared/ui/Icons'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { useRef, useState, useEffect } from 'react'

export type RegUserFormProps = {
  fullName: string
  birthday: string
  sex: string
  city: string
  categoryId: string
  subcategoryId: string
  avatar: File | null

  onChangeFullName: (value: string) => void
  onChangeBirthday: (value: string) => void
  onChangeSex: (value: string) => void
  onChangeCity: (value: string) => void
  onChangeCategoryId: (value: string) => void
  onChangeSubcategoryId: (value: string) => void
  onChangeAvatar: (file: File | null) => void
  sexOptions: { value: string; label: string }[]
  cityOptions: { value: string; label: string }[]
  categoryOptions: { value: string; label: string }[]
  subcategoryOptions: { value: string; label: string }[]

  errors: {
    fullName?: string
    birthday?: string
    sex?: string
    city?: string
    categoryId?: string
    subcategoryId?: string
    avatar?: string
  }

  onSubmit: () => void
  onBack: () => void
}

export function RegUserForm({
  fullName,
  birthday,
  sex,
  city,
  categoryId,
  subcategoryId,
  avatar,
  onChangeFullName,
  onChangeBirthday,
  onChangeSex,
  onChangeCity,
  onChangeCategoryId,
  onChangeSubcategoryId,
  onChangeAvatar,
  sexOptions,
  cityOptions,
  categoryOptions,
  subcategoryOptions,
  errors,
  onSubmit,
  onBack,
}: RegUserFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Восстанавливаем превью при монтировании, если аватарка уже была загружена
  useEffect(() => {
    if (avatar) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(avatar)
    }
  }, [avatar])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Валидация: только jpeg/png, ≤2MB
      const allowedTypes = ['image/jpeg', 'image/png']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!allowedTypes.includes(file.type)) {
        onChangeAvatar(null)
        return
      }

      if (file.size > maxSize) {
        onChangeAvatar(null)
        return
      }

      onChangeAvatar(file)

      // Создаём превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChangeAvatar(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBirthdayIconClick = () => {
    // Находим input даты рождения (он последний на странице с type="date")
    // и вызываем у него showPicker() или клик
    const dateInputs = document.querySelectorAll('input[type="date"]')
    const dateInput = dateInputs[dateInputs.length - 1] as HTMLInputElement
    if (dateInput) {
      // Пробуем нативный showPicker (современные браузеры)
      if (dateInput.showPicker) {
        dateInput.showPicker()
      } else {
        // Фоллбэк - фокус и клик
        dateInput.focus()
        dateInput.click()
      }
    }
  }

  return (
    <form className={styles.registerForm} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleAvatarChange}
        className={styles.fileInput}
      />
      <div className={styles.formContent}>
        <figure className={styles.avatarWrapper} onClick={handleAvatarClick}>
          {avatarPreview ? (
            <div className={styles.avatarPreview}>
              <img src={avatarPreview} alt="Аватар" />
              <button
                type="button"
                className={styles.removeAvatar}
                onClick={handleRemoveAvatar}
              >
                <CrossIcon />
              </button>
            </div>
          ) : (
            <Button className={styles.registerForm__avatar} variant="tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                fill="none"
                viewBox="0 0 72 72"
              >
                <path
                  stroke="#253017"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M53.946 56.174A22.47 22.47 0 0 0 36 47.25a22.47 22.47 0 0 0-17.946 8.925m35.892 0a27 27 0 1 0-35.892 0m35.892 0A26.92 26.92 0 0 1 36 63a26.9 26.9 0 0 1-17.946-6.825M45 29.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
                />
                <rect width="16" height="16" x="48" y="48" fill="#abd27a" rx="8" />
                <path
                  fill="#fff"
                  d="M60 56.5h-8a.504.504 0 0 1-.5-.5c0-.273.227-.5.5-.5h8c.273 0 .5.227.5.5s-.227.5-.5.5"
                />
                <path
                  fill="#fff"
                  d="M56 60.5a.504.504 0 0 1-.5-.5v-8c0-.273.227-.5.5-.5s.5.227.5.5v8c0 .273-.227.5-.5.5"
                />
              </svg>
            </Button>
          )}
          {errors.avatar && <span className={styles.avatarError}>{errors.avatar}</span>}
        </figure>
        <fieldset className={styles.registerForm__fieldset}>
          <legend className={styles.registerForm__fieldset__legend}>Личные данные</legend>
          <Input
            label="Имя"
            type="text"
            value={fullName}
            onChange={(e) => onChangeFullName(e.target.value)}
            placeholder="Введите ваше имя"
            description={errors.fullName || ''}
            isError={!!errors.fullName}
          />
          <div className={styles.registerForm__fieldset__block}>
            <Input
              label="Дата рождения"
              type="date"
              value={birthday}
              onChange={(e) => onChangeBirthday(e.target.value)}
              placeholder="дд.мм.гггг"
              description={errors.birthday || ''}
              isError={!!errors.birthday}
              rightIcon={<CalendarIcon />}
              onRightIconClick={handleBirthdayIconClick}
            />
            <Select
              label="Пол"
              value={sex}
              onChange={(value) => {
                if (typeof value === 'string') {
                  onChangeSex(value)
                }
              }}
              options={sexOptions}
              placeholder="Не указан"
              mode="simple"
              className={styles.select_for_form}
              isError={!!errors.sex}
            />
          </div>
        </fieldset>
        <fieldset className={styles.registerForm__fieldset}>
          <legend className={styles.registerForm__fieldset__legend}>Местоположение</legend>
          <Select
            label="Город"
            value={city}
            onChange={(value) => {
              if (typeof value === 'string') {
                onChangeCity(value)
              }
            }}
            options={cityOptions}
            placeholder="Выберите город"
            mode="simple"
            className={`${styles.select_in_flow} ${styles.select_in_flow_setting}`}
            isError={!!errors.city}
          />
        </fieldset>
        <fieldset className={styles.registerForm__fieldset}>
          <legend className={styles.registerForm__fieldset__legend}>Навыки и обучение</legend>
          <Select
            label="Категория навыка, которому хотите научиться"
            value={categoryId}
            onChange={(value) => {
              if (typeof value === 'string') {
                onChangeCategoryId(value)
              }
            }}
            options={categoryOptions}
            placeholder="Выберите категорию"
            mode="simple"
            className={styles.select_in_flow}
            isError={!!errors.categoryId}
          />
          <Select
            label="Подкатегория навыка, которому хотите научиться"
            value={subcategoryId}
            onChange={(value) => {
              if (typeof value === 'string') {
                onChangeSubcategoryId(value)
              }
            }}
            options={subcategoryOptions}
            placeholder="Выберите подкатегорию"
            mode="simple"
            className={styles.select_in_flow}
            isError={!!errors.subcategoryId}
          />
        </fieldset>
      </div>
      <div className={styles.registerForm__controls}>
        <Button
          type="button"
          className={styles.registerForm__controls__button}
          variant="secondary"
          onClick={onBack}
        >
          Назад
        </Button>
        <Button type="submit" className={styles.registerForm__controls__button}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}

export default RegUserForm
