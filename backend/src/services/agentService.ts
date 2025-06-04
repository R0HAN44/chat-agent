import Agent, { IAgent } from '../models/Agent';
import { Types } from 'mongoose';

export const createAgent = async (data: Partial<IAgent>) => {
  const agent = new Agent(data);
  return await agent.save();
};

export const getAgentsByUser = async (userId: string) => {
  return await Agent.find({ userId });
};

export const getAgentById = async (agentId: string, userId: string) => {
  return await Agent.findOne({ _id: agentId, userId });
};

export const deleteAgent = async (agentId: string, userId: string) => {
  return await Agent.findOneAndDelete({ _id: agentId, userId });
};
