import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadTabs from '@/components/shared/ThreadTabs';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  console.log(user);
  const userInfo = await fetchUser(params.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  return (
    <section>
      <ProfileHeader
        authId={user.id}
        accountId={userInfo.id}
        image={userInfo.image}
        name={userInfo.name}
        username={userInfo.username}
        bio={userInfo.bio}
      />
      <div className='my-10 bg-neutral-800 w-full h-0.5'></div>
      <Tabs defaultValue='threads' className='w-full'>
        <TabsList className='tab'>
          {profileTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='tab'>
              <Image
                src={tab.icon}
                alt={tab.label}
                width={24}
                height={24}
                className='object-contain'
              />
              <p className='max-sm:hidden'>{tab.label}</p>
              {tab.label === 'Threads' && (
                <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 text-light-2 text-[10px] font-medium'>
                  {userInfo.threads.length}
                </p>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {profileTabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.value} className='w-full'>
            <ThreadTabs
              currentUserId={user.id}
              accountId={userInfo._id}
              accountType='User'
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
