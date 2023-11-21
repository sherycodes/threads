'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CommentValidation } from '@/lib/validations/comment';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    await addCommentToThread({
      threadId,
      author: JSON.parse(currentUserId),
      content: values.comment,
      path: pathname,
    });
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full gap-4 items-center'
      >
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem className='flex flex-1 gap-3 items-center'>
              <FormLabel className='relative w-11 h-11'>
                <Image
                  src={currentUserImg}
                  alt='Profile Photo'
                  fill
                  className='rounded-full'
                />
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='bg-transparent border-none no-focus text-light-1'
                  placeholder='Comment...'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='bg-light-3 hover:bg-light-3 rounded-[24px] text-light-1 px-8 py-3'
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
