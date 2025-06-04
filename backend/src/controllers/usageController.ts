import { Request, Response } from 'express';
import UsageLog from '../models/UsageLog';
import { sendSuccess, sendError } from '../utils/apiResponse';
import mongoose from 'mongoose';

// GET /api/usage/summary
export const getUsageSummary = async (req: Request, res: Response) : Promise<any> => {
  try {
    const userId = req?.user?.id;

    const logs = await UsageLog.find({ userId });

    const totalCredits = logs.reduce((sum, log) => sum + log.totalTokens, 0);
    const agentsUsed = new Set(logs.map(log => log.agentId.toString())).size;
    const totalMessages = logs.length;

    return sendSuccess(res, 'Usage summary fetched successfully', {
      totalCredits,
      agentsUsed,
      totalMessages,
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch usage summary', error);
  }
};

// GET /api/usage/history
export const getUsageHistory = async (req: Request, res: Response) : Promise<any>=> {
  try {
    const userId = req?.user?.id;
    const { page = 1, limit = 20 } = req.query;

    const logs = await UsageLog.find({ userId })
      .populate('agentId', 'name')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await UsageLog.countDocuments({ userId });

    return sendSuccess(res, 'Usage history fetched successfully', {
      total,
      page: +page,
      limit: +limit,
      logs,
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch usage history', error);
  }
};
