export declare const locationImagesStorage: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: any, cb: any) => any;
    limits: {
        fileSize: number;
    };
};
