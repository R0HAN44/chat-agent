import { Router } from 'express';
import { createAction, getActionsByAgent, deleteAction, updateActionsByAgent } from '../controllers/actionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createAction);
router.get('/:agentId', getActionsByAgent);
router.put('/:actionId', updateActionsByAgent);
router.delete('/:actionId', deleteAction);

export default router;
