import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Check if mongoose is ready and connected
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this as IUser;
  
  // Only hash password if it's modified (or new)
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Using this pattern to ensure mongoose model is only created once
let User: any;

// Check if mongoose is ready before accessing models
try {
  // Check if the model exists
  User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
} catch (error) {
  console.error('Error creating User model:', error);
  // If we can't create the model, create a placeholder that throws a helpful error
  User = {
    findById: () => {
      throw new Error('Mongoose connection not established - make sure to connect to MongoDB before using models');
    },
    findOne: () => {
      throw new Error('Mongoose connection not established - make sure to connect to MongoDB before using models');
    },
    // Add other commonly used methods
  };
}

export default User;