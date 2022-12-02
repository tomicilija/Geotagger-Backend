import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { UnsupportedMediaTypeException, Logger } from '@nestjs/common';

const fileTypes = /\.(jpeg|jpg|png|gif|titf|jfif|svg)$/;
const fileSize = 5 * 1024 * 1024; // 5 MB

const filter = (req, file, cb) => {
  if (!file.originalname.match(fileTypes)) {
    Logger.error(`Only image types are allowed!`);
    return cb(
      new UnsupportedMediaTypeException('Only IMAGE types are allowed!'),
      false,
    );
  } else {
    cb(null, true);
  }
};

const editFileName = (req, file, cb) => {
  const filename: string =
    path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;

  cb(null, `${filename}${extension}`);
};

export const profilePictureStorage = {
  storage: diskStorage({
    destination: './uploads/profile-pictures',
    filename: editFileName,
  }),
  fileFilter: filter,
  limits: { fileSize: fileSize },
};
