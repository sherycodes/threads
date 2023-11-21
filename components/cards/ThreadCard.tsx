import { formatDateString } from '@/lib/utils';
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
  comments: any[];
  parentId: string;
  createdAt: Date;
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  content,
  author,
  community,
  comments,
  parentId,
  createdAt,
  isComment,
}: ThreadCardProps) => {
  return (
    <article
      className={`w-full rounded-xl ${
        isComment ? 'px-0 xs:px-7' : 'p-7 bg-dark-2'
      }`}
    >
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
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='text-[12px] font-weight-500 text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => (
            <div className='relative w-6 h-6'>
              <Image
                key={index}
                src={comment.author.image}
                alt={`user_${index}`}
                fill
                className={`${index !== 0 && '-ml-5'} rounded-full`}
              />
            </div>
          ))}

          <Link href={`/thread/${id}`}>
            <p
              className={`mt-1 text-subtle-medium text-gray-1 ${
                comments.length > 1 && '-ml-4'
              }`}
            >
              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${id}`}
          className='mt-5 flex items-center gap-4'
        >
          <p className='text-gray-1 text-[12px] font-medium'>
            {formatDateString(createdAt.toString())}
          </p>
          {/* <Image src=/> */}
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
