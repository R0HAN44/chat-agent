import { Router } from 'express';
import { createSource, getSourcesByAgent, deleteSource } from '../controllers/sourceController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { sendError, sendSuccess } from '../utils/apiResponse';

const router = Router();

router.use(authenticate);

router.post('/', createSource);
router.get('/:agentId', getSourcesByAgent);
router.delete('/:sourceId', deleteSource);
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req?.file?.filename}`;
    // You can now use this to create a source document entry
    sendSuccess(res, 'File uploaded', { fileUrl });
    return;
  } catch (error) {
    sendError(res, 'Upload failed', error);
    return;
  }
});

export default router;
