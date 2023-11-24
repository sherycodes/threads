'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import Image from 'next/image';

export default function Page({ routeType }: { routeType: string }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText) {
        router.push(`/${routeType}?q=${searchText}`);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [routeType, searchText]);
  return (
    <div className='w-full bg-dark-3 px-4 py-2 rounded-lg flex gap-1 items-center'>
      <Image
        src='/assets/search-gray.svg'
        alt='Search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        type='text'
        onChange={(e) => setSearchText(e.target.value)}
        className='no-focus outline-none border-none bg-dark-3 text-base text-light-4'
        placeholder={
          routeType === 'search'
            ? 'Search creators...'
            : 'Search communities...'
        }
      />
    </div>
  );
}
