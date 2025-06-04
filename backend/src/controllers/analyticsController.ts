import { Request, Response } from 'express';
import ChatLog from '../models/ChatLog';
import { sendError, sendSuccess } from '../utils/apiResponse';
import mongoose from 'mongoose';

export const getChatAnalytics = async (req: Request, res: Response) : Promise<any>  => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const chatCounts = await ChatLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), agentId: new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    return sendSuccess(res, 'Chat analytics fetched', chatCounts);
  } catch (error) {
    return sendError(res, 'Error fetching chat analytics', error);
  }
};

export const getTopicAnalytics = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const keywords = await ChatLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), agentId: new mongoose.Types.ObjectId(agentId) } },
      { $unwind: '$keywords' },
      {
        $group: {
          _id: '$keywords',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return sendSuccess(res, 'Top topics fetched', keywords);
  } catch (error) {
    return sendError(res, 'Error fetching topic analytics', error);
  }
};

export const getSentimentAnalytics = async (req: Request, res: Response) : Promise<any>  => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const sentiments = await ChatLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), agentId: new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    return sendSuccess(res, 'Sentiment analysis fetched', sentiments);
  } catch (error) {
    return sendError(res, 'Error fetching sentiment data', error);
  }
};
