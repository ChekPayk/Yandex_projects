import React from 'react';
import {
  BriefcaseIcon,
  GlobalIcon,
  HomeIcon,
  PaletteIcon,
  BookIcon,
  LifestyleIcon,
} from '@/shared/ui/Icons/index';


export const domainConfig: Record<string, { icon: React.ReactNode; bgColor: string }> = {
  '1': {
    icon: <PaletteIcon size={18} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-art)'
  },
  '2': {
    icon: <BookIcon size={19} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-education)'
  },
  '3': {
    icon: <GlobalIcon size={19} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-languages)'
  },
  '4': {
    icon: <HomeIcon size={19} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-home)'
  },
  '5': {
    icon: <BriefcaseIcon size={19} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-business)'
  },
  '6': {
    icon: <LifestyleIcon size={19} color="var(--color-text)" />,
    bgColor: 'var(--color-tag-health)'
  },
};
