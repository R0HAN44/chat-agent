import { Request, Response } from 'express';
import Integration from '../models/Integration';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { CustomRequest } from '../types/global';

export const createIntegration = async (req: CustomRequest, res: Response) => {
  try {
    const { agentId, type, config } = req.body;

    const integration = await Integration.create({
      agentId,
      type,
      config,
      createdBy: req?.user?.id,
    });

    sendSuccess(res, 'Integration created', integration);
  } catch (error) {
    sendError(res, 'Failed to create integration', error);
  }
};

export const getIntegrationsByAgent = async (req: CustomRequest, res: Response) => {
  try {
    const { agentId } = req.params;
    const integrations = await Integration.find({ agentId });
    sendSuccess(res, 'Fetched integrations', integrations);
    return;
  } catch (error) {
    sendError(res, 'Failed to fetch integrations', error);
    return;
  }
};
