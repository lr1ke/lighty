'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';
import { useTheme } from '@/app/context/ThemeContext';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Create',
    href: '/dashboard/create',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Personal',
    href: '/dashboard/personal',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Global',
    href: '/dashboard/global',
    icon: UserGroupIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { styles } = useTheme();
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-2 md:px-3",
              isActive ? `${styles.bgPrimary} ${styles.textAccent} font-semibold` : `${styles.bgPrimary} ${styles.textPrimary} hover:${styles.bgSecondary}`
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
      

    </>
  );
}