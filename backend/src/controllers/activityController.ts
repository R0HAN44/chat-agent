import { Request, Response } from 'express';
import ChatLog from '../models/ChatLog';
import Lead from '../models/Lead';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { CustomRequest } from '../types/global';

// GET /api/activity/chats/:agentId
export const getChatLogs = async (req: CustomRequest, res: Response) : Promise<any> => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const logs = await ChatLog.find({ userId, agentId }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Chat logs fetched successfully', logs);
  } catch (error) {
    return sendError(res, 'Failed to fetch chat logs', error);
  }
};

// GET /api/activity/leads/:agentId
export const getLeads = async (req: CustomRequest, res: Response) : Promise<any> => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const leads = await Lead.find({ userId, agentId }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Leads fetched successfully', leads);
  } catch (error) {
    return sendError(res, 'Failed to fetch leads', error);
  }
};
