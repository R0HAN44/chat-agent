import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';

export const registerUser = async (email: string, password: string, name: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    return await user.save();
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
};
