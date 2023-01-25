/// <reference types="multer" />
export declare class LocationDto {
    name: string;
    latitude: number;
    longitude: number;
    image: Express.Multer.File;
}
