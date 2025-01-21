import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('cloudinary')
@Controller('products/upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.url,
      public_id: uploadResult.public_id.split('/')[1],
    };
  }

  @Delete('image/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    return this.cloudinaryService.deleteImageFromCloudinary(
      `${process.env.CLOUDINARY_FOLDER_NAME}/${publicId}`,
    );
  }
}
