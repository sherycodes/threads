import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import UserCard from '@/components/cards/UserCard';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const { users, isNext } = await fetchUsers({
    userId: userInfo._id,
    searchText: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
  });
  return (
    <section className='w-full'>
      <h1 className='font-bold text-[30px] max-md:text-[26px] text-light-1 mb-10'>
        Search
      </h1>
      <div className='mb-10 w-full'>
        <SearchBar routeType='search' />
      </div>
      {users.length === 0 ? (
        <p className='text-gray-1 text-base font-medium w-full'>
          No users found
        </p>
      ) : (
        <div className='flex flex-col gap-6'>
          {users.map((item: any) => (
            <UserCard
              key={item.id}
              id={item.id}
              name={item.name}
              username={item.username}
              image={item.image}
            />
          ))}
        </div>
      )}
      <Pagination
        isNext={isNext}
        path='users'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
      />
    </section>
  );
}
