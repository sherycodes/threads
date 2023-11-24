'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import connectDB from '../mongoose';
import Community from '../models/community.model';

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
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );
    const createdThread = await Thread.create({
      content,
      author,
      community: communityIdObject,
    });

    if (createdThread) {
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });
    }

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
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
      .populate({
        path: 'community',
        model: Community,
        select: 'name image id',
      })
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

export async function getThreadById(id: string) {
  try {
    await connectDB();
    const post = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          { path: 'author', model: User, select: '_id id name image parentId' },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id parentId name image',
            },
          },
        ],
      })
      .exec();
    return post;
  } catch (error: any) {
    throw new Error(`Error getting post: ${error.message}`);
  }
}

interface AddCommentParams {
  threadId: string;
  content: string;
  author: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  content,
  author,
  path,
}: AddCommentParams) {
  try {
    await connectDB();
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error('Error fetching original thread');
    }
    const commentThread = new Thread({
      content,
      author,
      parentId: originalThread._id,
    });
    const savedComment = await commentThread.save();

    originalThread.children.push(savedComment._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}
