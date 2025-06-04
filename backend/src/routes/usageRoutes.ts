import { Router } from 'express';
import { getUsageSummary, getUsageHistory } from '../controllers/usageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', getUsageSummary);
router.get('/history', getUsageHistory);

export default router;
