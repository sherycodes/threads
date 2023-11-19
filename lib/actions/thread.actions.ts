'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import connectDB from '../mongoose';

interface CreateThreadParams {
  content: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  content,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  try {
    await connectDB();
    const createdThread = await Thread.create({
      content,
      author,
      community: communityId,
    });

    if (createdThread) {
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}
