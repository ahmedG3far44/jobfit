import { v2 as cloudinary } from 'cloudinary';
import { env } from '../configs/env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export const cloudinaryUpload = (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: 'resume-fit',
    resource_type: 'raw',
  });
};

export const cloudinaryUploadImage = (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: 'resume-fit/avatars',
    resource_type: 'image',
  });
};
