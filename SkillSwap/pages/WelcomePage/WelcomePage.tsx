import React from 'react'
import { Header } from '@/widgets/header'
import { SocialLoginForm } from '@/widgets/SocialLoginForm'
import { AuthForm } from '@/widgets/AuthForm'
import { IllustratedGuide } from '@/widgets/IllustratedGuide'
import { ROUTES } from '@/shared/lib/constants'
import { LightBulb } from '@/shared/ui/Illustrations'
import styles from './WelcomePage.module.css'
import { Link } from 'react-router-dom'

export const WelcomePage: React.FC = () => {
  // Обработчик отправки формы авторизации
  const handleAuthSubmit = (email: string, password: string) => {
    console.log('Попытка входа с данными:', { email, password })
    // Здесь будет вызов  метода авторизации
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Шапка с флагом для страницы авторизации */}
      <Header isAuthPage={true} />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Вход</h1>
        <div className={styles.container}>
          {/* Левая колонка: Форма входа и кнопка перехода к регистрации */}
          <section className={styles.authSection}>
            <div className={styles.formsContainer}>
              <SocialLoginForm />
              {/* Форма ввода email и пароля в режиме 'login' */}
              <AuthForm mode="login" onSubmit={handleAuthSubmit} />
            </div>

            <div className={styles.navigationFooter}>
              <Link to={ROUTES.REGISTER}>
                <span className={styles.textNavigationFooter}> Зарегистрироваться</span>
              </Link>
            </div>
          </section>

          {/* Правая колонка: Иллюстрация приветствия со светящейся лампочкой */}
          <section className={styles.visualSection}>
            <IllustratedGuide
              ImageComponent={LightBulb}
              title="С возвращением в SkillSwap!"
              description="Обменивайтесь знаниями и навыками с другими людьми"
            />
          </section>
        </div>
      </main>
    </div>
  )
}
