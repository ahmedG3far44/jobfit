import { Router } from 'express';
import { getVersions, getVersion, createVersion, updateVersion, deleteVersion } from '../controllers/version.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getVersions);
router.post('/', createVersion);
router.get('/:id', getVersion);
router.patch('/:id', updateVersion);
router.delete('/:id', deleteVersion);

export default router;
