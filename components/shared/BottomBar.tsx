'use client';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  const pathname = usePathname();
  return (
    <section className='bg-glassmorphism fixed bottom-0 z-20 w-full backdrop-blur-lg md:hidden p-4 xs:px-7 rounded-t-lg'>
      <ul className='flex items-center justify-between gap-3 xs:gap-5'>
        {sidebarLinks.map((link) => {
          const isActive =
            link.route === pathname ||
            (pathname.includes(link.route) && link.route.length > 1);
          return (
            <div className='group'>
              <Link
                href={link.route}
                key={link.label}
                className={`flex flex-col gap-2  items-center justify-center rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
                  isActive && 'bg-primary-500'
                } group-hover:bg-primary-500`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={16}
                  height={16}
                  className='object-contain'
                />
                <p className='text-light-1 text-sm font-medium max-sm:hidden'>
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            </div>
          );
        })}
      </ul>
    </section>
  );
}
