import { fetchUserPosts } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import { redirect } from 'next/navigation';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

interface ThreadTabsProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

interface Result {
  id: string;
  name: string;
  image: string;
  threads: {
    _id: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    author: {
      id: string;
      name: string;
      image: string;
    };
    children: {
      author: {
        id: string;
        name: string;
        image: string;
      };
    }[];
  }[];
}

export default async function Page({
  currentUserId,
  accountId,
  accountType,
}: ThreadTabsProps) {
  let result: Result;
  if (accountType === 'User') {
    result = await fetchUserPosts(accountId);
  } else {
    result = await fetchCommunityPosts(accountId);
  }
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
