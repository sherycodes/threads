import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import UserCard from '../cards/UserCard';
import { fetchCommunities } from '@/lib/actions/community.actions';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  const suggestedUsers = await fetchUsers({
    userId: userInfo._id,
    pageSize: 4,
  });
  const suggestedCommunities = await fetchCommunities({ pageSize: 4 });
  return (
    <section className='rightsidebar custom-scrollbar'>
      <div className='flex flex-col flex-1 gap-6'>
        <h2 className='font-medium text-light-1 text-[18px]'>
          Suggested Communities
        </h2>
        {suggestedCommunities.communities.length === 0 ? (
          <p className='text-light-3 text-base font-medium'>
            No communities yet
          </p>
        ) : (
          <div className='flex flex-col gap-8 w-[350px]'>
            {suggestedCommunities.communities.map((item) => (
              <UserCard
                key={item._id}
                id={item._id}
                name={item.name}
                username={item.username}
                image={item.image}
                personType='Community'
              />
            ))}
          </div>
        )}
      </div>
      <div className='flex flex-col flex-1 gap-6'>
        <h2 className='font-medium text-light-1 text-[18px]'>
          Suggested Users
        </h2>
        {suggestedUsers.users.length === 0 ? (
          <p className='text-light-3 text-base font-medium'>No users yet</p>
        ) : (
          <div className='flex flex-col gap-8 w-[350px]'>
            {suggestedUsers.users.map((item) => (
              <UserCard
                key={item._id}
                id={item._id}
                name={item.name}
                username={item.username}
                image={item.image}
                personType='User'
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
