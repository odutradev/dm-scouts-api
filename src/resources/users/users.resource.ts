import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { UserModelType } from "@utils/types/models/user";
import { hasUser } from "@database/functions/user";
import configModel from "@database/model/config";
import userModel from "@database/model/user";   

const usersResource = {
    signUp: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, password } = data;
            if (!id || !password) return manageError({ code: "invalid_data" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "registered") return manageError({ code: "user_already_registered" });

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            const extra: Partial<UserModelType> = {
                firstSignup: new Date(Date.now()),
                lastUpdate: new Date(Date.now()),
                status: "loggedIn",
                password
            };

            await userModel.findOneAndUpdate({ id }, { $set:{ ...extra } }, { new: true });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    signIn: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, password } = data;
            if (!id || !password) return manageError({ code: "no_credentials_sent" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "loggedIn") return manageError({ code: "user_has_not_been_registered" });

            var isPasswordMatch = await bcrypt.compare(password, findUser?.password || "");
            if (!isPasswordMatch) return manageError({ code: "invalid_credentials" });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUser: async ({  manageError, ids }: ManageRequestBody) => {
        try {
            return await hasUser({ _id: ids.userID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateProfile: async ({  data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;

            let filteredUpdatedUser = objectService.getObject(data, ["name", "description"]);

            if (filteredUpdatedUser.name){
                filteredUpdatedUser.name = stringService.filterBadwords(stringService.normalizeString(filteredUpdatedUser.name));
            };

            if (filteredUpdatedUser.description){
                filteredUpdatedUser.description = stringService.filterBadwords(stringService.normalizeString(filteredUpdatedUser.description));
            };

            return await userModel.findByIdAndUpdate(userID, { $set:{ ...filteredUpdatedUser, lastUpdate: Date.now() } }, { new: true }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getConfig: async ({ manageError }: ManageRequestBody) => {
        try {
            let config = await configModel.findOne();
    
            if (!config) {
                config = await configModel.create({});
            }

            return config;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default usersResource;