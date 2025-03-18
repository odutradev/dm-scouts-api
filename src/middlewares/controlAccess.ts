import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import sendError from "@utils/functions/error";
import logger from "@utils/functions/logger";

const controlAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  try {
    var controlAccessToken = req.header('controlAccess');
    if (!controlAccessToken){
      sendError({ code: "control_access_denied", res });
      return;
    };

    jwt.verify(controlAccessToken, (process.env.PRIVATE_ACCESS_TOKEN || ""), (error, decoded) => {
      if (error || !decoded || typeof decoded === 'string') {
        sendError({ code: "control_access_denied", res });
        return;
      };

      const publicToken = decoded?.publicToken as string | undefined;
      if (publicToken != process.env.PUBLIC_ACCESS_TOKEN){
        sendError({ code: "control_access_denied", res });
        return;
      }
      next();
    });

  } catch (error) {
    logger.error("[controlAccess] Control access internal error");
    console.log(error);
    sendError({ code: "internal_error", res });
    return;
  }
};

export default controlAccess;