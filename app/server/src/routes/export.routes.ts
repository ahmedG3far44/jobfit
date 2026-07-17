import { Router } from 'express';
import { exportPdf, exportDocx } from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/pdf', exportPdf);
router.post('/docx', exportDocx);

export default router;
