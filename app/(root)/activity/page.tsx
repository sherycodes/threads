import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const activities = await getActivity(userInfo._id);
  return (
    <div className='w-full'>
      <h1 className='font-bold text-[30px] max-md:text-[26px] text-light-1 mb-8'>
        Activity
      </h1>
      {activities.length === 0 ? (
        <p className='text-gray-1 text-base font-medium w-full'>
          No activites found
        </p>
      ) : (
        <div className='flex flex-col gap-4'>
          {activities.map((activity: any) => (
            <Link
              href={`/thread/${activity.parentId}`}
              key={activity._id}
              className='bg-dark-2 px-6 py-4 flex gap-2 items-center rounded-lg'
            >
              <div className='relative w-7 h-7'>
                <Image
                  src={activity.author.image}
                  alt='Profile'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <p className='text-light-1'>
                <span className='text-primary-500 font-semibold'>
                  {activity.author.name}
                </span>{' '}
                replied to your thread.
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
