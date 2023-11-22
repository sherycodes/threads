import Image from 'next/image';
import Link from 'next/link';

interface ProfileHeaderProps {
  image: string;
  name: string;
  username: string;
  bio: string;
  accountId: string;
  authId: string;
}

export default function Page({
  image,
  name,
  username,
  bio,
  accountId,
  authId,
}: ProfileHeaderProps) {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <div className='relative w-20 h-20'>
            <Image src={image} alt='Profile' fill className='rounded-full' />
          </div>
          <div className='flex flex-col justify-start'>
            <h3 className='text-[26px] text-light-1 font-bold max-md:text-[24px]'>
              {name}
            </h3>
            <p className='text-gray-1 text-sm'>@{username}</p>
          </div>
        </div>
        {accountId === authId && (
          <Link href='/profile/edit'>
            <div className='flex gap-3 items-center rounded-lg bg-dark-3 px-4 py-2'>
              <Image src='/assets/edit.svg' alt='Edit' width={16} height={16} />
              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </div>
          </Link>
        )}
      </div>
      <p className='text-base font-medium text-light-2 max-w-[80%]'>{bio}</p>
    </div>
  );
}
