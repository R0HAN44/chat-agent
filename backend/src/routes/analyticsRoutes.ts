import { Router } from 'express';
import { getChatAnalytics, getTopicAnalytics, getSentimentAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/chats/:agentId', getChatAnalytics);
router.get('/topics/:agentId', getTopicAnalytics);
router.get('/sentiment/:agentId', getSentimentAnalytics);

export default router;
