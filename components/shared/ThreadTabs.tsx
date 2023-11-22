import { fetchUserPosts } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import { redirect } from 'next/navigation';

interface ThreadTabsProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function Page({
  currentUserId,
  accountId,
  accountType,
}: ThreadTabsProps) {
  const result = await fetchUserPosts(accountId);
  if (!result) redirect('/');
  return (
    <div className='flex flex-col gap-10 mt-9'>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          content={thread.content}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          comments={thread.children}
          parentId={thread.parentId}
          createdAt={thread.createdAt}
          community={thread.community}
        />
      ))}
    </div>
  );
}
