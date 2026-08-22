import styles from './ProfilePage.module.css';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/header';
import { ProfileMenu, ProfileTab } from '@/widgets/ProfileMenu';
import { ProfileInfoForm } from '@/widgets/ProfileInfoForm';
import { UserIcon } from '@/shared/ui/UserIcon';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, LOCAL_STORAGE_KEYS } from '@/shared/lib/constants';
import { CardSkill } from '@/widgets/CardSkill';
import { InfiniteCardList } from '@/widgets/InfiniteCardList';
import type { SkillDomain, User, Skill } from '@/shared/types';
import { getAuthUser } from '@/features/auth/model/authUtils';
import { useAppSelector } from '@/store/hooks';
import { selectStep3Data } from '@/features/auth/model/RegistrationSlice';
import { selectUserSkill, selectUserSkillCategory, selectUserSkillDomain } from '@/store/userSkillSlice';
import users from '../../../public/db/users.json';
import skills from '../../../public/db/skills.json';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const usersData = users as User[];
  const skillDomains = skills.skillDomains as SkillDomain[];
  const authUser = getAuthUser();

  // Данные из Redux store (регистрация)
  const registrationStep3 = useAppSelector(selectStep3Data);
  const userSkill = useAppSelector(selectUserSkill);
  const userSkillCategory = useAppSelector(selectUserSkillCategory);
  const userSkillDomain = useAppSelector(selectUserSkillDomain);

  // Читаем аватарку из localStorage
  useEffect(() => {
    const avatarUrl = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_AVATAR);
    setUserAvatarUrl(avatarUrl);
  }, []);

  // Если пользователь не авторизован, то пока берём первого пользователя из списка
  const currentUser = useMemo(() => {
    if (!authUser) return usersData[0]

    return (
      usersData.find((user) => user.id === authUser.id) ??
      usersData[0]
    )
  }, [authUser, usersData]);

  const allDomains = skillDomains;
  const allCategories = allDomains.flatMap((domain) => domain.categories);
  const allSkills = allCategories.flatMap((category) => category.skills);

  // Получаем собственный навык: сначала из Redux (после регистрации), потом из users.json
  const ownSkill = useMemo<Skill | null>(() => {
    // Если есть навык в Redux store (из регистрации)
    if (userSkill) {
      return userSkill;
    }
    // Иначе пробуем найти в общих данных
    if (currentUser?.idSkill) {
      return allSkills.find((skill) => skill.id === currentUser.idSkill) ?? null;
    }
    return null;
  }, [userSkill, currentUser?.idSkill, allSkills]);

  // Получаем мета-информацию о навыке: из Redux или из общих данных
  const ownSkillMeta = useMemo(() => {
    // Если данные из Redux (регистрация)
    if (registrationStep3.skillCategory || registrationStep3.skillSubcategory) {
      return {
        categoryName: registrationStep3.skillCategory || 'Категория',
        domainName: registrationStep3.skillSubcategory || 'Домен',
      };
    }
    // Если данные из Redux store (userSkillSlice)
    if (userSkillCategory || userSkillDomain) {
      return {
        categoryName: userSkillCategory || 'Категория',
        domainName: userSkillDomain || 'Домен',
      };
    }
    // Иначе ищем в общих данных
    if (ownSkill) {
      const category = allCategories.find((item) => item.skills.some((skill) => skill.id === ownSkill.id));
      const domain = allDomains.find((item) => item.categories.some((cat) => cat.id === category?.id));
      return {
        categoryName: category?.name ?? 'Категория',
        domainName: domain?.name ?? 'Домен',
      };
    }
    return {
      categoryName: 'Категория',
      domainName: 'Домен',
    };
  }, [registrationStep3, userSkillCategory, userSkillDomain, ownSkill, allCategories, allDomains]);

  // Список пользователей, которые могут предложить обмен (не текущий пользователь)
  // TODO: Изменить логику, если появятся реальные данные обменов
  const suggestedUsers = useMemo(
    () => usersData.filter((user) => user.id !== currentUser.id),
    [currentUser.id, usersData],
  );

  const handleTabChange = (tab: ProfileTab) => {
    if (tab === 'favorites') {
      navigate(ROUTES.FAVORITES)
      return
    }

    setActiveTab(tab)
  }

  const renderContent = () => {
    if (activeTab === 'personal') {
      return (
        <>
          <ProfileInfoForm />
          <div className={styles.imageContainer}>
            <UserIcon
              avatarUrl={userAvatarUrl || currentUser.avatarUrl}
              name={currentUser.fullName}
            />
          </div>
        </>
      )
    }

    if (activeTab === 'skills') {
      // Если навык не найден, показываем заглушку
      if (!ownSkill) {
        return (
          <div className={styles.noSkill}>
            <p>У вас пока нет добавленного навыка</p>
          </div>
        )
      }
      return (
        <CardSkill
          pageVariant="home"
          title={ownSkill.name}
          domain={ownSkillMeta.domainName}
          category={ownSkillMeta.categoryName}
          description={ownSkill.description}
          images={ownSkill.skillImages}
        />
      )
    }

    return (
      <InfiniteCardList
        title={activeTab === 'requests' ? 'Заявки' : 'Мои обмены'}
        domains={allDomains}
        users={suggestedUsers}
      />
    )
  }

  return (
    <div className={styles.profileContainer}>
      <Header />
      <main className={styles.content}>
        <div className={`${styles.basicContainer} ${styles.menuContainer}`}>
          <ProfileMenu activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <div className={`${styles.basicContainer} ${styles.basicContainerPadding} ${styles.infoContainer}`}>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  )
}
