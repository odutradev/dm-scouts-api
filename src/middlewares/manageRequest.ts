import { Request, Response } from "express";

import { ResponseErrorsParams } from "@assets/config/errors";
import defaultConfig from "@assets/config/default";
import sendError from "@utils/functions/error";
import logger from "@utils/functions/logger";
import { deleteCacheFiles } from "./upload";

interface ManageErrorParams {
    code: ResponseErrorsParams;
    error?: any;
}

export interface ManageRequestBody {
    defaultExpress: {
        res: Response;
        req: Request;
    };
    ids: {
        spaceID?: string;
        classID?: string;
        userID?: string;
    };
    manageError: (data: ManageErrorParams) => void;
    files: Express.Multer.File[];
    params: any;
    data: any;
}

interface ManageRequestParams {
    service: (manageRequestBody: ManageRequestBody) => Promise<any> | any;
}

interface ManageRequestOptionsParams {
    upload?: boolean;
}

const manageRequest = (service: ManageRequestParams["service"], options?: ManageRequestOptionsParams) => {
    return async (req: Request, res: Response) => {
        let headersSent = false;
        let files: Express.Multer.File[] = [];

        if (options?.upload) {
           files = req.files as Express.Multer.File[]
        };

        const manageError = ({ code, error }: ManageErrorParams) => {
            if (headersSent) return;
            headersSent = true;
            sendError({ code, error, res, local: service.name });
        };

        try {
            const manageRequestBody: ManageRequestBody = {
                defaultExpress: { res, req },
                params: req.params,
                data: req.body,
                manageError,
                files,
                ids: {
                    spaceID: req.header('spaceID'),
                    classID: req.header('classID'),
                    userID: res.locals?.userID,
                },
            };

            const result = await service(manageRequestBody);

            if (options?.upload) {
               await deleteCacheFiles(files);
            };

            if (headersSent) return;

            res.set("api-database-name", defaultConfig.clusterName);
            res.set("api-version", defaultConfig.version);
            res.set("api-mode", defaultConfig.mode);
            res.status(200).json(result);
            headersSent = true;
        } catch (error) {
            if (!headersSent) {
                logger.error("[manageRequest] Request internal error");
                console.error(error);
                sendError({ code: "internal_error", res });
                headersSent = true;
            }
        }
    };
};

export default manageRequest;
