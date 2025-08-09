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
import ChatLog from '../models/ChatLog';
import Sentiment from "sentiment";
import keyword_extractor from "keyword-extractor";

export function extractKeywords(text: string): string[] {
    return keyword_extractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    });
}

const sentimentAnalyzer = new Sentiment();

export function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
    const result = sentimentAnalyzer.analyze(text);
    if (result.score > 1) return "positive";
    if (result.score < -1) return "negative";
    return "neutral";
}

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
        if (!agentId) {
            sendError(res, 'Agent ID is required');
            return;
        }
        const extractedSources = await Source.find({ userId: user?.id, agentId });
        // console.log(sources);
        // sendSuccess(res, 'Agent trained successfully');
        const seen = new Set();
        const sources = extractedSources.filter(s => {
            if (seen.has(s.type)) return false;
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


export const getAgentChatHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }

        const chatLogs = await agentService.getAgentChatLogs(id, user.id);

        if (!chatLogs) {
            sendNotFound(res, 'Agent chat not found');
            return;
        }

        sendSuccess(res, 'Agent chat fetched successfully', chatLogs);
    } catch (error) {
        sendError(res, 'Failed to fetch agent chat', error);
    }
};

export const postAgentChatHandler = async (req: any, res: any) => {
    try {
        const { id } = req.params; // agentId
        const { prompt } = req.body;
        const user = req.user;

        if (!user?.id) {
            sendError(res, 'Authentication required');
            return;
        }
        if (!prompt) {
            sendError(res, 'Prompt required');
            return;
        }

        // 1. Get AI response WITH action info
        const { answer, action, action_payload }: any = await agentService.chatWithAgent(id, prompt, user.id);
        console.log({ answer, action, action_payload });
        // 2. Sentiment & keyword analysis as before
        const sentiment = analyzeSentiment(prompt);
        const keywords = extractKeywords(prompt + " " + answer);

        // 3. Store in ChatLog (include action, action_payload)
        const chatLog = await ChatLog.create({
            userId: user.id,
            agentId: id,
            prompt,
            response: answer,
            sentiment,
            keywords,
            action,
            action_payload
        });
        console.log({ chatLog, action, action_payload });
        // 4. Return BOTH
        sendSuccess(res, 'Agent chat logged successfully', {
            chatLog,
            action: action || null,
            action_payload: action_payload || null
        });
    } catch (error) {
        sendError(res, 'Failed to send agent chat', error);
    }
};


