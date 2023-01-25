"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileImagesStorage = void 0;
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path = require("path");
const common_1 = require("@nestjs/common");
const fileTypes = /\.(jpeg|jpg|png|gif|tif|pjp|apng|ico|bmp|titf|jfif|svg)$/;
const fileSize = 5 * 1024 * 1024;
const editFileName = (req, file, cb) => {
    const filename = path.parse(file.originalname).name.replace(/\s/g, '') + (0, uuid_1.v4)();
    const extension = path.parse(file.originalname).ext;
    cb(null, `${filename}${extension}`);
};
const filter = (req, file, cb) => {
    if (!file.originalname.match(fileTypes)) {
        common_1.Logger.error(`Only image types are allowed!`);
        return cb(new common_1.UnsupportedMediaTypeException('Only IMAGE types are allowed!'), false);
    }
    else {
        cb(null, true);
    }
};
exports.profileImagesStorage = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/profile-pictures',
        filename: editFileName,
    }),
    fileFilter: filter,
    limits: { fileSize: fileSize },
};
//# sourceMappingURL=profile-images.storage.js.map