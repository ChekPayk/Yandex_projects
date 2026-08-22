import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Блокировка скролла при открытии
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Возвращаем исходное состояние при размонтировании
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Клик по затемнению (оверлею) – закрываем
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Рендерим в портал (корневой элемент #root или другой)
  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${className}`}>
        {children}
      </div>
    </div>,
    document.body // или document.getElementById('root')!
  );
};
