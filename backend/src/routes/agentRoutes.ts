import { Router } from 'express';
import {
  createAgentHandler,
  getAllAgentsHandler,
  getAgentByIdHandler,
  deleteAgentHandler,
  updateAgentByIdHandler,
  trainAgent,
  getAgentChatHandler,
  postAgentChatHandler,
} from '../controllers/agentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createAgentHandler);
router.get('/', getAllAgentsHandler);
router.get('/:id', getAgentByIdHandler);
router.put('/:id', updateAgentByIdHandler);
router.delete('/:id', deleteAgentHandler);

router.get('/chat/:id', getAgentChatHandler);
router.post('/chat/:id', postAgentChatHandler);


router.post('/train-agent', trainAgent)

export default router;
