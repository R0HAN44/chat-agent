import { Router } from 'express';
import { getChatLogs, getLeads } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/chats/:agentId', getChatLogs);
router.get('/leads/:agentId', getLeads);

export default router;
