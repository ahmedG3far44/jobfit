import { Router } from 'express';
import { getResumes, createResume, getResume, updateResume, deleteResume } from '../controllers/resume.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', getResumes);
router.post('/', upload.single('file'), createResume);
router.get('/:id', getResume);
router.patch('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
