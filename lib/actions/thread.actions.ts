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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    await connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      // .populate({path: 'community', model: Community})
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: '_id parentId name image',
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;
    return { isNext, posts };
  } catch (error: any) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}
