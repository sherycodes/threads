import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { getThreadById } from '@/lib/actions/thread.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/forms/Comment';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const thread = await getThreadById(params.id);
  return (
    <section className='relative'>
      <div className='mb-10'>
        <ThreadCard
          id={thread.id}
          content={thread.content}
          author={thread.author}
          community={thread.community}
          comments={thread.children}
          parentId={thread.parentId}
          createdAt={thread.createdAt}
        />
      </div>
      <div className='w-full bg-neutral-800 h-0.5'></div>
      <div className='my-8'>
        <Comment
          threadId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className='w-full bg-neutral-800 h-0.5'></div>
      <div className='mt-10 flex flex-col gap-5'>
        {thread.children.map((item: any) => (
          <ThreadCard
            key={item._id}
            id={item._id}
            author={item.author}
            content={item.content}
            community={item.community}
            comments={item.children}
            parentId={item.parentId}
            createdAt={item.createdAt}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
}
