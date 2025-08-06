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
    console.log("created action", action);
    sendSuccess(res, 'Action created', action);
  } catch (error) {
    sendError(res, 'Error creating action', error);
  }
};

export const getActionsByAgent = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const actions = await Action.find({ agentId });
    console.log("fetched actions", actions);
    sendSuccess(res, 'Fetched actions', actions);
  } catch (error) {
    sendError(res, 'Error fetching actions', error);
  }
};

export const updateActionsByAgent = async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;
    const { name, payload, type } = req.body; // only extract the allowed fields

    // Find the existing action by ID
    const existingAction = await Action.findById(actionId);
    if (!existingAction) {
      sendError(res, 'Action not found');
      return;
    }

    // Prepare the update object with only allowed fields if they are defined
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (payload !== undefined) updateData.payload = payload;
    if (type !== undefined) updateData.type = type;

    // If nothing to update, return early
    if (Object.keys(updateData).length === 0) {
      sendError(res, 'No valid fields provided for update');
      return;
    }

    // Update only the allowed fields
    const updatedAction = await Action.findByIdAndUpdate(
      actionId,
      { $set: updateData },
      { new: true }
    );

    console.log('Updated action:', updatedAction);
    sendSuccess(res, 'Action updated successfully', updatedAction);
  } catch (error) {
    console.error('Error updating action:', error);
    sendError(res, 'Error updating action', error);
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
