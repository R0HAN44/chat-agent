// src/controllers/agentController.ts
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
        const { name, aimodel, systemPrompt } = req.body;
        // Type assertion - safe because authenticate middleware guarantees user exists
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const agent = await agentService.createAgent({
            userId: new mongoose.Types.ObjectId(user.id),
            name,
            aimodel,
            systemPrompt,
            status: 'active',
        });
        console.log(agent)
        sendCreated(res, 'Agent created successfully', agent);
    } catch (error) {
        sendError(res, 'Agent creation failed', error);
    }
};

export const getAllAgentsHandler = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const agents = await agentService.getAgentsByUser(user.id);
        sendSuccess(res, 'Agents fetched successfully', agents);
    } catch (error) {
        sendError(res, 'Failed to fetch agents', error);
    }
};

export const getAgentByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const agent = await agentService.getAgentById(id, user.id);

        if (!agent) {
            sendNotFound(res, 'Agent not found');
            return;
        }

        sendSuccess(res, 'Agent fetched successfully', agent);
    } catch (error) {
        sendError(res, 'Failed to fetch agent', error);
    }
};

export const updateAgentByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const existingAgent = await agentService.getAgentById(id, user.id);

        if (!existingAgent) {
            sendNotFound(res, 'Agent not found');
            return;
        }

        const { aimodel, name, systemPrompt, status } = req.body;

        const updatedAgent = await agentService.updateAgentById(id, user.id, {
            aimodel,
            name,
            systemPrompt,
            status
        });

        sendSuccess(res, 'Agent updated successfully', updatedAgent);
    } catch (error) {
        sendError(res, 'Failed to update agent', error);
    }
};


export const deleteAgentHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const agent = await agentService.deleteAgent(id, user.id);

        if (!agent) {
            sendNotFound(res, 'Agent not found or already deleted');
            return;
        }

        sendSuccess(res, 'Agent deleted successfully');
    } catch (error) {
        sendError(res, 'Failed to delete agent', error);
    }
};