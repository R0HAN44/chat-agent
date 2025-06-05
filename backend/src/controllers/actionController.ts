import { Request, Response } from 'express';
import Action from '../models/Action';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const createAction = async (req: Request, res: Response) => {
  try {
    const { agentId, name, type, payload } = req.body;

    const action = await Action.create({
      agentId,
      name,
      type,
      payload,
      createdBy: (req as any).user._id, // or extend your Request interface for strong typing
    });

    sendSuccess(res, 'Action created', action);
  } catch (error) {
    sendError(res, 'Error creating action', error);
  }
};

export const getActionsByAgent = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const actions = await Action.find({ agentId });
    sendSuccess(res, 'Fetched actions', actions);
  } catch (error) {
    sendError(res, 'Error fetching actions', error);
  }
};

export const deleteAction = async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;
    await Action.findByIdAndDelete(actionId);
    sendSuccess(res, 'Action deleted');
  } catch (error) {
    sendError(res, 'Error deleting action', error);
  }
};
