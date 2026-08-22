import { useState, useRef, useEffect, useCallback } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { Input } from '../Input'
import styles from './DatePicker.module.css'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}

const calendarIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'ДД.ММ.ГГГГ',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftDate, setDraftDate] = useState<Date | undefined>(value ?? undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [month, setMonth] = useState<Date>(value ?? new Date())

  const displayValue = value ? formatDate(value) : ''

  const handleFocus = useCallback(() => {
    setDraftDate(value ?? undefined)
    setMonth(value ?? new Date())
    setIsOpen(true)
  }, [value])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    onChange(draftDate ?? null)
    setIsOpen(false)
  }, [draftDate, onChange])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={styles.container}>
      <Input
        onChange={() => {}}
        value={displayValue}
        placeholder={placeholder}
        type="text"
        description=""
        label={label}
        rightIcon={calendarIcon}
        readOnly
        onFocus={handleFocus}
      />
      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={draftDate}
            onSelect={setDraftDate}
            month={month}
            onMonthChange={setMonth}
            locale={ru}
            captionLayout="dropdown"
            hideNavigation
            defaultMonth={value ?? new Date()}
            weekStartsOn={1}
            footer={
              <div className={styles.footer}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={handleCancel}
                >
                  Отменить
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSelect}`}
                  onClick={handleConfirm}
                >
                  Выбрать
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
