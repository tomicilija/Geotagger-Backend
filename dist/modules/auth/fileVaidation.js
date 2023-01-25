"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSizeValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const fileTypes = /\.(jpeg|jpg|png|gif|titf|svg)$/;
const fileSize = 5 * 1024 * 1024;
let FileSizeValidationPipe = class FileSizeValidationPipe {
    transform(value) {
        if (!value.originalname.match(fileTypes)) {
            throw new common_1.UnsupportedMediaTypeException('Only IMAGE types are allowed!');
        }
        if (value.size > fileSize) {
            throw new common_1.PayloadTooLargeException('Image too large! Max size allowed is 5 MB!');
        }
    }
};
FileSizeValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileSizeValidationPipe);
exports.FileSizeValidationPipe = FileSizeValidationPipe;
//# sourceMappingURL=fileVaidation.js.map