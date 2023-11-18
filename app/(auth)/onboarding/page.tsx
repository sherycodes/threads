import { currentUser } from '@clerk/nextjs';
// import { fetchUser } from '@/lib/actions/user.actions';
import AccountProfile from '@/components/forms/AccountProfile';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // const userInfo = await fetchUser(user.id);

  const userData = {
    userId: user.id,
    // objectId: userInfo?._id,
    // username: userInfo ? userInfo.username : user.username,
    // name: userInfo ? userInfo.name : user.firstName ?? '',
    // bio: userInfo ? userInfo.bio : '',
    // image: userInfo ? userInfo.image : user.imageUrl,
    objectId: '',
    username: user.username || '',
    name: user.firstName || '',
    bio: '',
    image: user.imageUrl || '',
  };
  return (
    <main className='w-full max-w-3xl mx-auto flex flex-col py-20 px-10 justify-start'>
      <h3 className='font-bold text-[26px] lg:text-[30px] text-light-1'>
        Onboarding
      </h3>
      <p className='text-light-1 text-base'>
        Complete your profile now to use Threads
      </p>
      <section className='mt-9 bg-dark-2 p-10 rounded-lg'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}
