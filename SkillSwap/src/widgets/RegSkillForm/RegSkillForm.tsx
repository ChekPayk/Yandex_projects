import { FC, ChangeEvent, useMemo, useState, useEffect } from 'react'
import { Input } from '@/shared/ui/Input'
import { TextArea } from '@/shared/ui/TextArea'
import { Button } from '@/shared/ui/Button'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Select } from '@/shared/ui/Select'
import { fetchSkillDomains } from '@/api/skills'
import type { SkillDomain } from '@/shared/types'
import styles from './RegSkillForm.module.css'

export type RegSkillFormData = {
  skillName: string
  category: string
  subcategory: string
  description: string
  images: File[]
}

export type RegSkillFormProps = {
  skillName: string
  category: string
  subcategory: string
  description: string
  images: File[]

  onChangeSkillName: (value: string) => void
  onChangeCategory: (value: string) => void
  onChangeSubcategory: (value: string) => void
  onChangeDescription: (value: string) => void
  onChangeImages: (files: File[]) => void

  onBack: () => void
  onSubmit: () => void

  errors?: {
    skillName?: string
    category?: string
    subcategory?: string
    description?: string
    images?: string
  }
}

export const RegSkillForm: FC<RegSkillFormProps> = ({
  skillName,
  category,
  subcategory,
  description,
  images,
  onChangeSkillName,
  onChangeCategory,
  onChangeSubcategory,
  onChangeDescription,
  onChangeImages,
  onBack,
  onSubmit,
  errors = {},
}) => {
  const [skillDomains, setSkillDomains] = useState<SkillDomain[]>([])

  // Загружаем домены навыков при монтировании
  useEffect(() => {
    fetchSkillDomains()
      .then((domains) => {
        setSkillDomains(domains)
      })
      .catch((err) => {
        console.error('Failed to load skill domains:', err)
      })
  }, [])

  const categoryOptions = useMemo(() => {
    return skillDomains.map((domain) => ({
      value: domain.id,
      label: domain.name,
    }))
  }, [skillDomains])

  const subcategoryOptions = useMemo(() => {
    if (!category) return []
    const selectedDomain = skillDomains.find((d) => d.id === category)
    if (!selectedDomain?.categories) return []

    return selectedDomain.categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [category, skillDomains])

  const handleSkillNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSkillName(e.target.value)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDescription(e.target.value)
  }

  const handleImagesChange = (files: File[]) => {
    onChangeImages(files)
  }

  return (
    <div className={styles.form}>
      <div className={styles.inputs}>
        <Input
          label="Название навыка"
          type="text"
          placeholder="Введите название вашего навыка"
          value={skillName}
          onChange={handleSkillNameChange}
          description={errors.skillName || ''}
          isError={!!errors.skillName}
        />

        <Select
          label="Категория навыка"
          value={category}
          onChange={(value) => {
            if (typeof value === 'string') {
              onChangeCategory(value)
              onChangeSubcategory('') // Сбрасываем подкатегорию при смене категории
            }
          }}
          options={categoryOptions}
          placeholder="Выберите категорию"
          mode="simple"
          className={styles.select}
          isError={!!errors.category}
        />

        <Select
          label="Подкатегория навыка"
          value={subcategory}
          onChange={(value) => {
            if (typeof value === 'string') {
              onChangeSubcategory(value)
            }
          }}
          options={subcategoryOptions}
          placeholder="Выберите подкатегорию"
          mode="simple"
          className={styles.select}
          isError={!!errors.subcategory}
          disabled={!category}
        />

        <TextArea
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          value={description}
          onChange={handleDescriptionChange}
          rows={3}
          description={errors.description || ''}
          isError={!!errors.description}
        />

        <ImageUpload
          value={images}
          onChange={handleImagesChange}
          maxFiles={5}
          isError={!!errors.images}
          errorMessage={errors.images}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className={styles.button}
        >
          Назад
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          className={styles.button}
        >
          Продолжить
        </Button>
      </div>
    </div>
  )
}