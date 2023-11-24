import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser } from '@clerk/nextjs';
import { communityTabs } from '@/constants';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import Image from 'next/image';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadTabs from '@/components/shared/ThreadTabs';
import UserCard from '@/components/cards/UserCard';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const community = await fetchCommunityDetails(params.id);
  return (
    <section>
      <ProfileHeader
        authUserId={user.id}
        accountId={community.createdBy.id}
        image={community.image}
        name={community.name}
        username={community.username}
        bio={community.bio}
        type='Community'
      />
      <div className='my-10 bg-neutral-800 w-full h-0.5'></div>
      <Tabs defaultValue='threads' className='w-full'>
        <TabsList className='tab'>
          {communityTabs.map((tab) => (
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
                  {community.threads.length}
                </p>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {communityTabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.value} className='w-full'>
            {tab.value === 'members' ? (
              <div className='mt-9 flex flex-col gap-10'>
                {community.members.map((member: any) => (
                  <UserCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    username={member.username}
                    image={member.image}
                  />
                ))}
              </div>
            ) : (
              <ThreadTabs
                currentUserId={user.id}
                accountId={community._id}
                accountType='Community'
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
