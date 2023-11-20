import Image from 'next/image';
import Link from 'next/link';

interface ThreadCardProps {
  id: string;
  content: string;
  author: {
    id: string;
    image: string;
    name: string;
  };
  community: string | null;
  comments: any[] | null;
  parentId: string;
  createdAt: Date;
}

const ThreadCard = ({
  id,
  content,
  author,
  community,
  comments,
  parentId,
  createdAt,
}: ThreadCardProps) => {
  return (
    <article className='bg-dark-2 w-full rounded-xl p-7'>
      <div className='flex justify-between items-start'>
        <div className='flex gap-4 w-full'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='Profile'
                fill
                className='rounded-full cursor-pointer'
              />
            </Link>
            <div className='mt-2 w-0.5 bg-neutral-800 rounded-full grow relative'></div>
          </div>
          <div className='flex flex-col w-full'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='text-light-1 font-semibold text-base'>
                {author.name}
              </h4>
            </Link>
            <p className='text-sm text-light-2 mt-2'>{content}</p>
            <div className='mt-5 flex flex-col gap-3'>
              <div className='flex gap-3.5'>
                <Image
                  src='/assets/heart-gray.svg'
                  alt='Like'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='Reply'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='Repost'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='Share'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
