import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { generateToken } from '../utils/jwt';
import { sendCreated, sendSuccess, sendUnauthorized, sendError } from '../utils/apiResponse';

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const user = await registerUser(email, password, name);
        const token = generateToken(user.id.toString());
        
        sendCreated(res, "Registration successful", { token, user });
        return;
    } catch (err) {
        sendError(res, 'Registration failed', err);
        return;
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);
        if (!user) {
            sendUnauthorized(res, 'Invalid credentials');
            return;
        }

        const token = generateToken(user.id.toString());
        sendSuccess(res, "Login successful", { token, user });
        return;
    } catch (err) {
        sendError(res, 'Login failed', err);
        return;
    }
};