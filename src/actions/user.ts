// src/actions/user.ts
'use server';

import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/user';
import { getCurrentUser } from '@/lib/utils/auth';
import './config';

// Get user by ID
export async function getUser(id: string) {
  try {
    await dbConnect();
    
    const user = await User.findById(id).lean();
    
    if (!user) {
      return null;
    }
    
    const { password, ...userData } = user;
    
    return JSON.parse(JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to get user:', error);
    throw new Error('Failed to get user');
  }
}

// Get all users (admin only)
export async function getUsers() {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    await dbConnect();
    
    const users = await User.find({})
      .select('-password')
      .lean();
    
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Failed to get users:', error);
    throw new Error('Failed to get users');
  }
}

// Update user profile
export async function updateUserProfile(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    await dbConnect();
    
    const user = await User.findById(currentUser.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update name if provided
    if (data.name) {
      user.name = data.name;
    }
    
    // Update email if provided
    if (data.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ email: data.email });
      
      if (existingUser && existingUser._id.toString() !== currentUser.id) {
        throw new Error('Email already in use');
      }
      
      user.email = data.email;
    }
    
    // Update password if provided
    if (data.currentPassword && data.newPassword) {
      // Verify current password
      const isPasswordValid = await user.comparePassword(data.currentPassword);
      
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      user.password = data.newPassword;
    }
    
    await user.save();
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}

// Create new user (admin only)
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}) {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    await dbConnect();
    
    // Check if email is already in use
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const user = await User.create(data);
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Update user (admin only)
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
    password?: string;
  }
) {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    await dbConnect();
    
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update fields if provided
    if (data.name) {
      user.name = data.name;
    }
    
    if (data.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ email: data.email });
      
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error('Email already in use');
      }
      
      user.email = data.email;
    }
    
    if (data.role) {
      user.role = data.role;
    }
    
    if (data.isActive !== undefined) {
      user.isActive = data.isActive;
    }
    
    if (data.password) {
      user.password = data.password;
    }
    
    await user.save();
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

// Delete user (admin only)
export async function deleteUser(id: string) {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    // Ensure admin cannot delete themselves
    if (currentUser.id === id) {
      throw new Error('Cannot delete your own account');
    }
    
    await dbConnect();
    
    await User.findByIdAndDelete(id);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}