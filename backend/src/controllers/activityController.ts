import { Request, Response } from 'express';
import ChatLog from '../models/ChatLog';
import Lead from '../models/Lead';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { CustomRequest } from '../types/global';

// GET /api/activity/chats/:agentId
export const getChatLogs = async (req: CustomRequest, res: Response): Promise<any> => {
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
export const getLeads = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const leads = await Lead.find({ userId, agentId }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Leads fetched successfully', leads);
  } catch (error) {
    return sendError(res, 'Failed to fetch leads', error);
  }
};

export const createLead = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const userId = req?.user?.id;
    const agentId = req?.params?.agentId;
    const { email, phone, name, message } = req.body;

    const newLead = new Lead({ userId, agentId, email, phone, name, message });
    await newLead.save();

    return sendSuccess(res, 'Lead created successfully', newLead);
  } catch (error) {
    return sendError(res, 'Failed to create lead', error);
  }
};


export const updateChatLog = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { chatlogid } = req.params;
    const { response, sentiment } = req.body;

    const updateData: any = {};
    if (response !== undefined) updateData.response = response;
    if (sentiment !== undefined) updateData.sentiment = sentiment;

    const updatedLog = await ChatLog.findByIdAndUpdate(
      { _id: chatlogid },
      updateData,
      { new: true }
    );

    if (!updatedLog) {
      return sendError(res, 'Chat log not found', null);
    }

    return sendSuccess(res, 'Chat log updated successfully', updatedLog);
  } catch (error) {
    return sendError(res, 'Failed to update chat log', error);
  }
};