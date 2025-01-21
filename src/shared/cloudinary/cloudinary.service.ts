import { Injectable } from '@nestjs/common';
import { v2 as uploadV2 } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    uploadV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // upload image to Cloudinary
  async uploadImage(file: any): Promise<any> {
    try {
      return await new Promise((resolve, reject) => {
        const upload = uploadV2.uploader.upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER_NAME },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }

  // Method to delete image from Cloudinary by public_id
  async deleteImageFromCloudinary(publicId: string) {
    try {
      return await new Promise((resolve, reject) => {
        uploadV2.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              message: 'Image deleted successfully',
              public_id: publicId.split('/')[1],
              ...result,
            });
          }
        });
      });
    } catch (error) {
      throw new Error('Error deleting image to Cloudinary');
    }
  }
}
