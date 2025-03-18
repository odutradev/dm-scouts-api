import { isValidObjectId } from "mongoose";

import { UserModelType } from "bonfire-shared-types";
import userModel from "@database/model/user";

export const hasExistsUser = async (user: Partial<UserModelType>, manageError: Function): Promise<boolean | undefined> => {
    if (user._id && !isValidObjectId(user._id)){
        return true;
    };
    const hasUser: UserModelType | null = await userModel.findOne(user).select("-password");
    if (hasUser){
        manageError({ code: "user_already_exists" }); 
        return;
    };
    return true;
};

export const hasUser = async (user: Partial<UserModelType>, manageError: Function): Promise<UserModelType | undefined> => {
    if (user._id && !isValidObjectId(user._id)){
        manageError({ code: "invalid_params" }); 
        return;
    };
    const hasUser: UserModelType | null = await userModel.findOne(user).select("-password");
    if (!hasUser){
        manageError({ code: "user_not_found" }); 
        return;
    };
    return hasUser;
};