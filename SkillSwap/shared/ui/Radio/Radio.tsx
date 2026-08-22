import React from 'react'
import styles from './Radio.module.css'

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: React.ReactNode
}

export function Radio({ label, className = '', icon, ...inputProps }: RadioProps) {
  return (
    <label className={`${styles.container} ${className}`.trim()}>
      <input type="radio" className={styles.input} {...inputProps} />
      {icon}
      <span className={styles.label}>{label}</span>
    </label>
  )
}

export default Radio
