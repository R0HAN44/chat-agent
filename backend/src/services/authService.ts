import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ email, password: hashedPassword, name });
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
};
