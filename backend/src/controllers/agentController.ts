import { Request, Response } from 'express';
import * as agentService from '../services/agentService';
import {
    sendSuccess,
    sendCreated,
    sendError,
    sendNotFound,
} from '../utils/apiResponse';
import mongoose from 'mongoose';

export const createAgentHandler = async (req: Request, res: Response) => {
    try {
        const { name, model, systemPrompt } = req.body;

        const agent = await agentService.createAgent({
            userId: new mongoose.Types.ObjectId(req.user!.id),
            name,
            model,
            systemPrompt,
            status: 'active',
        });
        sendCreated(res, 'Agent created successfully', agent); return;
    } catch (error) {
        sendError(res, 'Agent creation failed', error); return;
    }
};

export const getAllAgentsHandler = async (req: Request, res: Response) => {
    try {
        const agents = await agentService.getAgentsByUser(req.user!.id);
        sendSuccess(res, 'Agents fetched successfully', agents);
        return;
    } catch (error) {
        sendError(res, 'Failed to fetch agents', error); return;
    }
};

export const getAgentByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const agent = await agentService.getAgentById(id, req.user!.id);

        if (!agent) { sendNotFound(res, 'Agent not found'); return; }

        sendSuccess(res, 'Agent fetched successfully', agent);
        return;
    } catch (error) {
        sendError(res, 'Failed to fetch agent', error);
        return;
    }
};

export const deleteAgentHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const agent = await agentService.deleteAgent(id, req.user!.id);

        if (!agent) { sendNotFound(res, 'Agent not found or already deleted'); return; };

        sendSuccess(res, 'Agent deleted successfully');
        return;
    } catch (error) {
        sendError(res, 'Failed to delete agent', error);
        return;
    }
};
