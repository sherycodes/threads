'use client';
import React from 'react';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className='bg-dark-2 sticky left-0 top-0 z-20 w-fit h-screen flex flex-col justify-between max-md:hidden border-r border-r-dark-4 pt-28 pb-5 overflow-auto custom-scrollbar'>
      <ul className='flex flex-col gap-6 w-full px-6 flex-1'>
        {sidebarLinks.map((link) => {
          const isActive =
            link.route === pathname ||
            (pathname.includes(link.route) && link.route.length > 1);
          return (
            <div className='group'>
              <Link
                href={`${
                  link.label === 'Profile' ? `/profile/${userId}` : link.route
                }`}
                key={link.label}
                className={`flex justify-start gap-4 p-4 rounded-lg ${
                  isActive && 'bg-primary-500'
                } group-hover:bg-primary-500`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={20}
                  height={20}
                />
                <p className='text-light-1 text-sm lg:text-base'>
                  {link.label}
                </p>
              </Link>
            </div>
          );
        })}
      </ul>
      <div className='mt-10 px-8'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className='flex gap-2 items-center p-4 cursor-pointer'>
              <Image
                src='/assets/logout.svg'
                alt='Logout'
                width={20}
                height={20}
              />
              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}
