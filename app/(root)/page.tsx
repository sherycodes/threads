import { fetchPosts } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import ThreadCard from '@/components/cards/ThreadCard';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo) redirect('/onboarding');
  const { posts } = await fetchPosts(1, 30);
  return (
    <>
      <h1 className='font-bold text-[30px] text-light-1 max-md:text-[25px]'>
        Home
      </h1>
      <section className='flex flex-col gap-10 justify-start w-full mt-10'>
        {posts.length === 0 ? (
          <p className='text-center text-light-3'>No threads found!</p>
        ) : (
          posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              content={post.content}
              author={post.author}
              comments={post.children}
              currentUserId={user.id}
              parentId={post.parentId}
              createdAt={post.createdAt}
              community={post.community}
            />
          ))
        )}
      </section>
    </>
  );
}
