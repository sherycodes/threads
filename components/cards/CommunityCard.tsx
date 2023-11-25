import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Member {
  image: string;
}

interface CommunityCardProps {
  id: string;
  name: string;
  username: string;
  image: string;
  members: Member[];
}

export default function Page({
  id,
  image,
  name,
  username,
  members,
}: CommunityCardProps) {
  return (
    <div className='bg-dark-3 flex flex-col gap-8 justify-start px-4 py-5 rounded-lg sm:w-[360px]'>
      <div className='flex flex-wrap items-center gap-4'>
        <Link href={`/communities/${id}`} className='relative w-12 h-12'>
          <Image
            src={image}
            alt='Profile'
            fill
            className='object-cover rounded-full'
          />
        </Link>
        <div className='flex-1 text-ellipsis'>
          <Link href={`/communities/${id}`}>
            <h3 className='text-light-1 text-[18px] font-medium'>{name}</h3>
          </Link>
          <p className='text-gray-1 text-sm font-medium'>@{username}</p>
        </div>
      </div>
      <div className='flex justify-between items-center w-full flex-wrap gap-3'>
        <Link href={`/communities/${id}`}>
          <Button className='bg-primary-500 min-w-[74px] h-auto text-light-1 font-medium rounded-lg hover:bg-primary-500'>
            View
          </Button>
        </Link>
        {members.length > 0 && (
          <div className='flex items-center'>
            {members.map((member: Member, index: number) => (
              <div
                key={index}
                className={`relative w-7 h-7 ${index !== 0 && '-ml-2'}`}
              >
                <Image
                  src={member.image}
                  alt='Profile'
                  fill
                  className='rounded-full'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
