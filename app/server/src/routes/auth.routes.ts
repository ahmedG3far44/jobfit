import { Router } from 'express';
import { register, login, getMe, logout, updateProfile, uploadProfilePicture } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { uploadImage } from '../middlewares/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/profile/picture', authenticate, uploadImage.single('avatar'), uploadProfilePicture);

export default router;
