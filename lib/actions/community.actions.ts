'use server';
import { revalidatePath } from 'next/cache';
import Community from '../models/community.model';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import connectDB from '../mongoose';
import { FilterQuery, SortOrder } from 'mongoose';

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  bio: string,
  image: string,
  createdById: string
) {
  try {
    await connectDB();
    const user = await User.findById({ id: createdById });
    if (!user) {
      throw new Error('User not found');
    }
    const community = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id,
    });
    const createdCommunity = await community.save();
    user.communities.push(createdCommunity._id);
    await user.save();
    return createdCommunity;
  } catch (error: any) {
    throw new Error(`Error creating community: ${error.message}`);
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    await connectDB();
    const communityDetails = await Community.findOne({ id }).populate([
      'createdBy',
      { path: 'members', model: User, select: 'name username image _id id' },
    ]);
    return communityDetails;
  } catch (error: any) {
    throw new Error(`Error fetching community details: ${error.message}`);
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    await connectDB();
    const communityPosts = await Community.findOne({ id }).populate({
      path: 'threads',
      model: Thread,
      populate: [
        { path: 'author', model: User, select: 'name image id' },
        {
          path: 'children',
          model: Thread,
          populate: { path: 'author', model: User, select: 'name image _id' },
        },
      ],
    });
    return communityPosts;
  } catch (error: any) {
    throw new Error(`Error fetching community posts: ${error.message}`);
  }
}

export async function fetchCommunities({
  pageNumber = 1,
  pageSize = 20,
  searchText = '',
  sortBy = 'desc',
}: {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const query: FilterQuery<typeof Community> = {};
    if (searchText) {
      const regex = new RegExp(searchText, 'i');
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const communitiesQuery = Community.find(query)
      .limit(pageSize)
      .skip(skipAmount)
      .sort(sortOptions)
      .populate('members');
    const totalCommunitiesDocuments = await Community.countDocuments(query);
    const communities = await communitiesQuery.exec();
    const isNext = totalCommunitiesDocuments > skipAmount + communities.length;
    return { isNext, communities };
  } catch (error: any) {
    throw new Error(`Error fetching communities: ${error.message}`);
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    await connectDB();
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    const user = await User.findOne({ id: memberId });
    if (!user) {
      throw new Error('User not found');
    }
    if (community.members.includes(user._id)) {
      throw new Error('User is already a member of the community');
    }

    community.members.push(user._id);
    await community.save();

    user.communities.push(community._id);
    await user.save();
    return community;
  } catch (error: any) {
    throw new Error(`Error adding member: ${error.message}`);
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    await connectDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error('User not found');
    }

    if (!communityIdObject) {
      throw new Error('Community not found');
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error('Error removing user from community:', error);
    throw error;
  }
}
export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    await connectDB();
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );
    if (!updatedCommunity) {
      throw new Error('Community not found');
    }
    return updatedCommunity;
  } catch (error: any) {
    throw new Error(`Error updating community: ${error.message}`);
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    await connectDB();
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });
    if (!deletedCommunity) {
      throw new Error('Community not found');
    }
    await Thread.deleteMany({ community: communityId });
    const communityUsers = await User.find({ communities: communityId });
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });
    await Promise.all(updateUserPromises);
    return deletedCommunity;
  } catch (error: any) {
    throw new Error(`Error deleting community: ${error.message}`);
  }
}
