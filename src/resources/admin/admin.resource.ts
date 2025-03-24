import bcrypt from "bcrypt";

import { hasUser, hasExistsUser } from "@database/functions/user";
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { UserModelType } from "@utils/types/models/user";
import userModel from "@database/model/user";
import configModel from "@database/model/config";

const adminResource = {
    createUser: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let { id, name, group, role } = data;
            if (!id || !name) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);
            name = stringService.normalizeString(name);

            const userExists = await hasExistsUser({ id }, manageError);
            if (!userExists) return;

            if (role == "admin") role = "normal";

            const extra: Partial<UserModelType> = {
                lastUpdate: new Date(Date.now()),
            };
            
            const createdUser = new userModel({ id, name, group, ...extra });
            await createdUser.save();

            return createdUser;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateUser: async ({ data, manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;

            const filteredUser = objectService.filterObject(data, ["id", "order", "createAt", "password", "_id"]);
            
            if (filteredUser.role == "admin") filteredUser.role = "normal";

            if (filteredUser.name){
                filteredUser.name = stringService.normalizeString(filteredUser.name);
            };

            if (filteredUser.description){
                filteredUser.description = stringService.normalizeString(filteredUser.description);
            };

            return await userModel.findByIdAndUpdate(userID, { $set:{ ...filteredUser, lastUpdate: Date.now() } }, { new: true }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateUserPassword: async ({ data, manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;

            let { password } = data;
            if (!password) return manageError({ code: "invalid_data" });

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            return await userModel.findByIdAndUpdate(userID, { $set:{ password, lastUpdate: Date.now() } }, { new: true }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteUser: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;
            
            await userModel.findByIdAndDelete(userID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUser: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

           return await hasUser({ _id: userID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getAllUsers: async ({ manageError }: ManageRequestBody) => {
        try {
           return await userModel.find().sort({ date: -1 }).select('-password');
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateConfig: async ({ data, manageError }: ManageRequestBody) => {
        try {
            let config = await configModel.findOne();
    
            if (!config) {
                config = await configModel.create({});
            }
    
            config = await configModel.findOneAndUpdate(
                {},
                { $set: { ...data, lastUpdate: Date.now() } },
                { new: true }
            );
    
            return config;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default adminResource;