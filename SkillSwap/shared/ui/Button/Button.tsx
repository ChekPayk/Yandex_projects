import React from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type IconPosition = 'before' | 'after'

export type ButtonProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: IconPosition
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  disabled?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = 'before',
  type = 'button',
  variant = 'primary',
  disabled = false,
  className,
  onClick,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    icon ? (iconPosition === 'after' ? styles.iconAfter : styles.iconBefore) : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick} {...props}>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
