'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserValidation } from '@/lib/validations/user';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import * as z from 'zod';
import Image from 'next/image';

interface AccountProfileProps {
  user: {
    userId: string;
    objectId: string;
    name: string;
    username: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export default function AccountProfile({
  user,
  btnTitle,
}: AccountProfileProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: user?.name ? user.name : '',
      username: user?.username ? user.username : '',
      bio: user?.bio ? user.bio : '',
      image: user?.image ? user.image : '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    const blob = values.image;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imageRes = await startUpload(files);
      console.log(imageRes);
      if (imageRes && imageRes[0].fileUrl) {
        values.image = imageRes[0].fileUrl;
      }
    }

    await updateUser({
      userId: user.userId,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: values.image,
      path: pathname,
    });

    if (pathname === '/profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes('image')) return;
      reader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || '';
        fieldChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-10 justify-start'
      >
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='h-24 w-24 flex justify-center items-center bg-dark-4 rounded-full'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='Profile Photo'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/create.svg'
                    alt='Create'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base font-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Upload a photo'
                  className='bg-transparent border-none cursor-pointer outline-none file:text-blue'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3'>
              <FormLabel className='text-light-2 font-semibold'>Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='bg-dark-3 text-light-1 border border-dark-4 no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3'>
              <FormLabel className='text-light-2 font-semibold'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='bg-dark-3 text-light-1 border border-dark-4 no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3'>
              <FormLabel className='text-light-2 font-semibold'>Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
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
}
