import { Router } from 'express';
import { getChatAnalytics, getTopicAnalytics, getSentimentAnalytics, getUsageLogs, getChatLogs } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/chats/:agentId', getChatAnalytics);
router.get('/topics/:agentId', getTopicAnalytics);
router.get('/sentiment/:agentId', getSentimentAnalytics);

router.get('/usage-logs/:agentId', getUsageLogs);
router.get('/chat-logs/:agentId', getChatLogs);

export default router;
