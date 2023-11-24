'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  image: string;
  personType?: string;
}

export default function Page({
  id,
  image,
  name,
  username,
  personType,
}: UserCardProps) {
  const router = useRouter();
  const isCommunity = personType === 'Community';
  const handleClick = () => {
    if (isCommunity) {
      router.push(`/communities/${id}`);
    } else {
      router.push(`/users/${id}`);
    }
    return;
  };
  return (
    <div className='flex justify-between xs:items-center gap-4 w-full max-xs:flex-col max-xs:bg-dark-3 max-xs:p-4 max-xs:rounded-xl'>
      <div className='flex items-start justify-start xs:items-center gap-3 flex-1'>
        <div className='relative w-14 h-14'>
          <Image
            src={image}
            alt='Profile'
            fill
            className='object-cover rounded-full'
          />
        </div>
        <div className='flex-1 text-ellipsis'>
          <h3 className='text-light-1 text-[18px] font-medium'>{name}</h3>
          <p className='text-gray-1 text-sm font-medium'>@{username}</p>
        </div>
      </div>

      <Button
        onClick={handleClick}
        className='bg-primary-500 min-w-[74px] h-auto text-light-1 font-medium rounded-lg hover:bg-primary-500'
      >
        View
      </Button>
    </div>
  );
}
