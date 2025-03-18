import fs from "fs/promises";
import multer from "multer";
import path from "path";

import stringService from "@utils/services/stringServices";

const ensureDirectoryExists = async (dirPath: string) => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

export const deleteCacheFiles = async (files: Express.Multer.File[]) => {
    if (files?.length > 0){
        await Promise.all(
            files.map(async (file) => {
                if (file.path) await fs.unlink(file.path);
            })
        );
    }
};

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadPath = path.resolve(__dirname, "../../cache/files");
            await ensureDirectoryExists(uploadPath);
            cb(null, uploadPath);
        } catch (error) {
            cb(error as Error, "");
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${stringService.removeSpacesAndLowerCase(file.originalname)}`);
    },
});

const upload = multer({
    limits: { fileSize: 15 * 1024 * 1024 },
    storage,
});

export default upload;