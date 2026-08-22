import React from 'react';
import styles from './UserIcon.module.css';
import fallbackAvatar from './avatar-01.png';

export type UserIconProps = {
  avatarUrl: string | null;
  name: string;
  className?: string;
};

export const UserIcon: React.FC<UserIconProps> = ({ avatarUrl, name, className }) => {
  return (
    <img
      src={avatarUrl ?? fallbackAvatar}
      alt={name}
      className={`${styles.icon} ${className ?? ''}`}
    />
  );
};
