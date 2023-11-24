import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUser, getUserReplies } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadTabs from '@/components/shared/ThreadTabs';
import ThreadCard from '@/components/cards/ThreadCard';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id);
  if (!userInfo.onboarded) redirect('/onboarding');
  const replies = await getUserReplies(userInfo._id);
  return (
    <section>
      <ProfileHeader
        authUserId={user.id}
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

        <TabsContent value='threads'>
          <ThreadTabs
            currentUserId={user.id}
            accountId={userInfo._id}
            accountType='User'
          />
        </TabsContent>
        <TabsContent value='replies'>
          {replies.length === 0 ? (
            <p className='text-gray-1 text-base font-medium w-full'>No replies found</p>
          ) : (
            <div className='flex flex-col gap-10 mt-9'>
              {replies.map((reply) => (
                <ThreadCard
                  key={reply._id}
                  id={reply._id}
                  content={reply.content}
                  author={reply.author}
                  community={reply.community}
                  isComment={true}
                  comments={reply.children}
                  createdAt={reply.createdAt}
                  parentId={reply.parentId}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
