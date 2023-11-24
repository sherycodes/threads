'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ThreadValidation } from '@/lib/validations/thread';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.actions';
import { useOrganization } from '@clerk/nextjs';

interface PostThreadProps {
  author: string;
  btnTitle: string;
}

const PostThread = ({ author, btnTitle }: PostThreadProps) => {
  const { organization } = useOrganization();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ThreadValidation>) {
    await createThread({
      content: values.content,
      author,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    router.push('/');
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-10 justify-start'
      >
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3'>
              <FormLabel className='text-light-2 font-semibold'>
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  className='bg-dark-3 text-light-1 border border-dark-4 no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-light-3 w-full hover:bg-light-3'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
