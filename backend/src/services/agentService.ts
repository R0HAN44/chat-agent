import Agent, { IAgent } from '../models/Agent';
import { Types } from 'mongoose';

export const createAgent = async (data: Partial<IAgent>) => {
  const agent = new Agent(data);
  console.log(data)
  return await agent.save();
};

export const getAgentsByUser = async (userId: string) => {
  return await Agent.find({ userId });
};

export const getAgentById = async (agentId: string, userId: string) => {
  return await Agent.findOne({ _id: agentId, userId });
};

export const updateAgentById = async (agentId: string, userId: string, updatedData: any) => {
  return await Agent.findOneAndUpdate(
    { _id: agentId, userId },
    { $set: updatedData },
    { new: true } // return the updated document
  );
};


export const deleteAgent = async (agentId: string, userId: string) => {
  return await Agent.findOneAndDelete({ _id: agentId, userId });
};
