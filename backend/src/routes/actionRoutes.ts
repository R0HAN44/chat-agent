import { Router } from 'express';
import { createAction, getActionsByAgent, deleteAction } from '../controllers/actionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createAction);
router.get('/:agentId', getActionsByAgent);
router.delete('/:actionId', deleteAction);

export default router;
