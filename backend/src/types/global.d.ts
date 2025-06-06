import { Request, Response } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    // add other user fields here if needed
  };
}

export {}