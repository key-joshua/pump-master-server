import dotenv from 'dotenv';
import { v2 } from 'cloudinary';
import StatusCodes from 'http-status-codes';
import responseUtils from '../utils/responseUtils';

dotenv.config();

v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const uploadService = async (req, res, next) => {
  const singleFile = req?.files?.file;
  const multipleFiles = req?.files?.attachments;

  // === Handle Single File ===
  if (singleFile) {
    const filename = singleFile.originalFilename || '';
    const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    const allowedSingleExtensions = ['.jpg', '.png'];

    if (!allowedSingleExtensions.includes(extension)) {
      responseUtils.handleError(
        StatusCodes.BAD_REQUEST,
        'Invalid file type. Accepted types for profile picture: .jpg, .png'
      );
      return responseUtils.response(res);
    }

    try {
      const result = await v2.uploader.upload(singleFile.path);
      req.body.profile_picture = result?.url;
    } catch (error) {
      responseUtils.handleError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to upload profile picture. Please try again.'
      );
      return responseUtils.response(res);
    }
  }

  // === Handle Multiple Files ===
  if (multipleFiles && (Array.isArray(multipleFiles) ? multipleFiles.length > 0 : true)) {
    const documentsArray = Array.isArray(multipleFiles) ? multipleFiles : [multipleFiles];
    const allowedMultiExtensions = ['.pdf', '.doc', '.docx'];
    const uploadedUrls: string[] = [];

    for (const file of documentsArray) {
      const filename = file.originalFilename || '';
      const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase();

      if (!allowedMultiExtensions.includes(extension)) {
        responseUtils.handleError(
          StatusCodes.BAD_REQUEST,
          'Invalid document type. Accepted types: .pdf, .doc, .docx'
        );
        return responseUtils.response(res);
      }

      try {
        const result = await v2.uploader.upload(file.path, {
          resource_type: 'raw',
        });
        uploadedUrls.push(result?.url);
      } catch (error) {
        responseUtils.handleError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to upload document. Please try again.'
        );
        return responseUtils.response(res);
      }
    }

    req.body.attachments = uploadedUrls;
  }

  return next();
};

export { uploadService };
