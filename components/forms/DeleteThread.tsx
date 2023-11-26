'use client';
import { usePathname, useRouter } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';

interface DeleteThreadProps {
  currentUserId: string;
  authorId: string;
  threadId: string;
  parentId: string;
  isComment?: boolean;
}

export default function Page({
  currentUserId,
  authorId,
  threadId,
  isComment,
  parentId,
}: DeleteThreadProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = async () => {
    await deleteThread(JSON.parse(threadId), pathname);
    if (!parentId || !isComment) {
      router.push('/');
    }
  };

  if (currentUserId !== authorId || pathname === '/') return null;
  return (
    <Image
      src='/assets/delete.svg'
      alt='delete'
      width={18}
      height={18}
      className='object-contain cursor-pointer'
      onClick={handleClick}
    />
  );
}
