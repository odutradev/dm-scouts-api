import { Request, Response, NextFunction } from "express";

import sendError from "@utils/functions/error";
import userModel from "@database/model/user";
import logger from "@utils/functions/logger";

const hasAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  try {
    const userID = res.locals?.userID;
    if (!userID){
      sendError({ code: "invalid_credentials", res });
      return;
    };

    const user = await userModel.findOne({ _id: userID });
    if (!user){
      sendError({ code: "admin_access_denied", res })
      return;
    }; 

    if (user.role != "admin"){
      sendError({ code: "admin_access_denied", res })
      return;
    };

    next();
  } catch (error) {
    logger.error("[hasAdmin] Admin validation internal error");
    console.log(error);
    sendError({ code: "internal_error", res });
    return;
  }
};

export default hasAdmin;