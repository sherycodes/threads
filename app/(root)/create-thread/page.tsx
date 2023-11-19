import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';
import Image from 'next/image';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  return (
    <>
      <div className='flex gap-3 w-full items-center'>
        <Image
          src='/assets/create.svg'
          alt='Create'
          width={25}
          height={25}
          className='object-contain'
        />
        <h3 className='font-bold text-[30px] text-light-1 max-md:text-[25px]'>
          Create Thread
        </h3>
      </div>
      <section className='mt-9'>
        <PostThread author={userInfo._id} btnTitle='Post Thread' />
      </section>
    </>
  );
}
