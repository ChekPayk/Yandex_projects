import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styles from './Button.module.css'
import { ButtonVariant, IconPosition } from './Button'

export type ButtonLinkProps = Omit<LinkProps, 'children'> & {
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: IconPosition
  variant?: ButtonVariant
  className?: string
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  icon,
  iconPosition = 'before',
  variant = 'primary',
  className,
  ...props
}) => {
  const linkClasses = [
    styles.button,
    styles[variant],
    icon ? (iconPosition === 'after' ? styles.iconAfter : styles.iconBefore) : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link className={linkClasses} {...props}>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <span>{children}</span>
    </Link>
  )
}
