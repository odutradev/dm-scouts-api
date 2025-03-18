import { Response } from "express";

import { ResponseErrors, ResponseErrorsParams } from "@assets/config/errors";
import defaultConfig from "@assets/config/default";
import logger from "./logger";

export interface SendErrorParams {
    code:  ResponseErrorsParams;
    local?: String;
    res: Response;
    options?: {};
    error?: any;
};

const sendError = ({ code, res, error, local } : SendErrorParams) => {
    try {
        const localMessage = local ? `[${local}] ` : "";
        const responseError = ResponseErrors[code];

        if (defaultConfig.logError.message) logger.error(localMessage + responseError.message);
        if (error && defaultConfig.logError.data) console.log(error);

        res.status(responseError.statusCode).json(responseError);
        return "error";
    } catch (error) {
        logger.error("[sendError] Server error");
        console.log(error);

        const serverErrorResponse = ResponseErrors["internal_error"]
        res.status(500).json(serverErrorResponse);
        return "error";
    }
};

export default sendError;