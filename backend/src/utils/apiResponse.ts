
import { Response } from 'express';

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export const sendSuccess = (
    res: Response, 
    message: string, 
    data?: any, 
    statusCode: number = 200
) => {
    const response: ApiResponse = {
        success: true,
        message,
        ...(data && { data })
    };
    
    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response, 
    message: string, 
    error?: any, 
    statusCode: number = 500
) => {
    const response: ApiResponse = {
        success: false,
        message,
        ...(error && { error })
    };
    
    return res.status(statusCode).json(response);
};

// Specific success responses
export const sendCreated = (res: Response, message: string, data?: any) => {
    return sendSuccess(res, message, data, 201);
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized') => {
    return sendError(res, message, null, 401);
};

export const sendNotFound = (res: Response, message: string = 'Not found') => {
    return sendError(res, message, null, 404);
};

export const sendBadRequest = (res: Response, message: string, error?: any) => {
    return sendError(res, message, error, 400);
};