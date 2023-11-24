import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import AccountProfile from '@/components/forms/AccountProfile';
import Image from 'next/image';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  const userData = {
    userId: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo.username : user.username,
    name: userInfo ? userInfo.name : user.firstName ?? '',
    bio: userInfo ? userInfo.bio : '',
    image: userInfo ? userInfo.image : user.imageUrl,
  };
  return (
    <>
      <div className='flex gap-3 w-full items-center'>
        <Image
          src='/assets/edit.svg'
          alt='Edit'
          width={25}
          height={25}
          className='object-contain'
        />
        <h3 className='font-bold text-[30px] text-light-1 max-md:text-[25px]'>
          Edit Profile
        </h3>
      </div>

      <section className='mt-9 bg-dark-2 p-10 rounded-lg'>
        <AccountProfile user={userData} btnTitle='Edit' />
      </section>
    </>
  );
}
