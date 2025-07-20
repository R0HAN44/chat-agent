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
import { getSourcesByAgent } from './sourceController';
import Source from '../models/Source';
import { handlePDFSource, handleQNASource, handleTextSource, handleWebsiteSource } from '../services/trainAgentService';

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

export const trainAgent = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.body;
        const user = (req as any).user;
        if(!agentId){
            sendError(res, 'Agent ID is required');
            return;
        }
        const extractedSources = await Source.find({ userId : user?.id, agentId});
        // console.log(sources);
        // sendSuccess(res, 'Agent trained successfully');
        const seen = new Set();
        const sources = extractedSources.filter(s => {
            if(seen.has(s.type)) return false;
            seen.add(s.type);
            return true;
        }) 
        console.log(agentId);
        for (const source of sources) {
            switch (source.type) {
                case 'document':
                    await handlePDFSource(source, agentId);
                    break;
                case 'website':
                    await handleWebsiteSource(source, agentId);
                    break;
                case 'qna':
                    await handleQNASource(source, agentId);
                    break;
                case 'text':
                    await handleTextSource(source, agentId);
                    break;
                default:
                    console.warn(`Unknown source type: ${source.type}`);
                    break;
            }
        }

        sendSuccess(res, 'Agent training initiated successfully');


    } catch (error) {
        sendError(res, 'Failed to delete agent', error);
    }
};
