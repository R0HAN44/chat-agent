import { Request, Response } from 'express';
import Source from '../models/Source';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { CustomRequest } from '../types/global';

// POST /api/sources
export const createSource = async (req: CustomRequest, res: Response) : Promise<any> => {
  try {
    const { type, title, content, fileUrl, metadata, agentId } = req.body;
    const userId = req?.user?.id;

    const newSource = await Source.create({
      userId,
      agentId,
      type,
      title,
      content,
      fileUrl,
      metadata
    });

    return sendSuccess(res, 'Source created successfully', newSource);
  } catch (error) {
    return sendError(res, 'Failed to create source', error);
  }
};

// GET /api/sources/:agentId
export const getSourcesByAgent = async (req: CustomRequest, res: Response)  :Promise<any> => {
  try {
    const { agentId } = req.params;
    const userId = req?.user?.id;

    const sources = await Source.find({ userId, agentId });

    return sendSuccess(res, 'Sources fetched', sources);
  } catch (error) {
    return sendError(res, 'Failed to fetch sources', error);
  }
};

// DELETE /api/sources/:sourceId
export const deleteSource = async (req: CustomRequest, res: Response) : Promise<any> => {
  try {
    const { sourceId } = req.params;
    const userId = req?.user?.id;

    const result = await Source.findOneAndDelete({ _id: sourceId, userId });

    if (!result) return sendError(res, 'Source not found', null, 404);

    return sendSuccess(res, 'Source deleted');
  } catch (error) {
    return sendError(res, 'Error deleting source', error);
  }
};
