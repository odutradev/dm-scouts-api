import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import sendError from "@utils/functions/error";
import logger from "@utils/functions/logger";

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  try {
    var token = req.header('authorization');
    if (!token){
      sendError({ code: "no_token", res });
      return;
    };

    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded || typeof decoded === 'string'){
      sendError({ code: "token_is_not_valid", res });
      return;
    };

    const userID = decoded?.id as string | undefined;
    res.locals.userID = userID;
    next();

  } catch (error) {
    logger.error("[auth] Auth internal error");
    console.log(error);
    sendError({ code: "internal_error", res });
    return;
  }
};

export default auth;