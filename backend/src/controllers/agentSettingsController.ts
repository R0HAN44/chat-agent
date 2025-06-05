import { Request, Response } from 'express';
import AgentSettings from '../models/AgentSettings';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const getSettings = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { agentId } = req.params;
        const settings = await AgentSettings.findOne({ agentId });
        if (!settings) return sendError(res, 'Settings not found', null, 404);
        sendSuccess(res, 'Fetched settings', settings);
    } catch (err) {
        sendError(res, 'Failed to fetch settings', err);
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const data = req.body;

        const updated = await AgentSettings.findOneAndUpdate(
            { agentId },
            { ...data, updatedAt: new Date() },
            { new: true, upsert: true }
        );

        sendSuccess(res, 'Settings updated', updated);
    } catch (err) {
        sendError(res, 'Failed to update settings', err);
    }
};
