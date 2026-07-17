import { Router } from 'express';
import { fitResumeHandler, coverLetterHandler } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/fit-resume', fitResumeHandler);
router.post('/cover-letter', coverLetterHandler);

export default router;
