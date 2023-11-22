import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import UserCard from '@/components/cards/UserCard';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const { users } = await fetchUsers({ userId: userInfo._id });
  return (
    <section className='w-full'>
      <h1 className='font-bold text-[30px] max-md:text-[26px] text-light-1 mb-10'>
        Search
      </h1>
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
    </section>
  );
}
