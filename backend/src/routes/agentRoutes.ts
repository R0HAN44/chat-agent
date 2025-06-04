import { Router } from 'express';
import {
  createAgentHandler,
  getAllAgentsHandler,
  getAgentByIdHandler,
  deleteAgentHandler,
} from '../controllers/agentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createAgentHandler);
router.get('/', getAllAgentsHandler);
router.get('/:id', getAgentByIdHandler);
router.delete('/:id', deleteAgentHandler);

export default router;
