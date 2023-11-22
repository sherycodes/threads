'use server';
import { revalidatePath } from 'next/cache';
import { FilterQuery, SortOrder } from 'mongoose';
import User from '../models/user.model';
import connectDB from '../mongoose';
import Thread from '../models/thread.model';

interface UserParams {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  name,
  username,
  image,
  bio,
  path,
}: UserParams) {
  try {
    await connectDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        onboarded: true,
        name,
        bio,
        image,
      },
      { upsert: true }
    );
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Error creating/updating user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    await connectDB();
    const result = await User.findById(userId).populate({
      path: 'threads',
      model: Thread,
      populate: [
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'id name image',
          },
        },
      ],
    });
    return result;
  } catch (error: any) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}

interface FetchUsersParams {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchText?: string;
  sortBy?: SortOrder;
}

export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 20,
  searchText = '',
  sortBy = 'desc',
}: FetchUsersParams) {
  try {
    await connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const query: FilterQuery<typeof User> = { _id: { $ne: userId } };
    if (searchText) {
      const searchRegex = new RegExp(searchText, 'i');
      query.$or = [
        { username: { $regex: searchRegex } },
        { name: { $regex: searchRegex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalUsersCount = await User.countDocuments(query);
    const isNext = totalUsersCount > skipAmount + users.length;
    return { isNext, users };
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    await connectDB();
    const userThreads = await Thread.find({ author: userId });
    // Get child threads
    const childThreadsIds = userThreads.reduce(
      (acc, childThread) => acc.concat(childThread.children),
      []
    );
    const replies = await Thread.find({
      _id: { $in: childThreadsIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });
    return replies;
  } catch (error: any) {
    throw new Error(`Error fetching activity: ${error.message}`);
  }
}
