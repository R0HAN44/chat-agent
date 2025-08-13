import { Router } from 'express';
import { createLead, getChatLogs, getLeads, updateChatLog } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/chats/:agentId', getChatLogs);
router.get('/leads/:agentId', getLeads);

router.post('/leads/:agentId', createLead);

router.put('/updatechatlog/:chatlogid', updateChatLog);

export default router;
