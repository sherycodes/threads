import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CommunityCard from '@/components/cards/CommunityCard';
import SearchBar from '@/components/shared/SearchBar';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const { communities } = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });
  return (
    <section className='w-full'>
      <h1 className='font-bold text-[30px] max-md:text-[26px] text-light-1 mb-10'>
        Communities
      </h1>
      <div className='mb-10 w-full'>
        <SearchBar routeType='communities' />
      </div>
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
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
}
