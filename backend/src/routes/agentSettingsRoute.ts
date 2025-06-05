import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/agentSettingsController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/:agentId', getSettings);
router.put('/:agentId', updateSettings);

export default router;
