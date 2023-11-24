import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CommunityCard from '@/components/cards/CommunityCard';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const { communities } = await fetchCommunities({
    pageNumber: 1,
    pageSize: 20,
  });
  return (
    <section className='w-full'>
      <h1 className='font-bold text-[30px] max-md:text-[26px] text-light-1 mb-10'>
        Communities
      </h1>
      <div className='w-full flex flex-wrap gap-8'>
        {communities.length === 0 ? (
          <p className='text-center text-light-3'>No communities found!</p>
        ) : (
          communities.map((community: any) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              image={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
}
