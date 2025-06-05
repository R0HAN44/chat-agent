import { Router } from 'express';
import { createIntegration, getIntegrationsByAgent } from '../controllers/integrationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createIntegration);
router.get('/:agentId', getIntegrationsByAgent);

export default router;
