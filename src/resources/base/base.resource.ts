import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";
import baseModel from "@database/model/base";
import userModel from "@database/model/user";

const baseResource = {
    createBase: async ({ manageError, data }: ManageRequestBody) => {
        try {
            let { name, description, leaderID, branch, number, local } = data;
            if (!name) return manageError({ code: "invalid_data" });

            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));
            name = stringService.normalizeString(name);

            const leader = await hasUser({ _id: leaderID }, manageError);
            if (!leader) return;

            const newBase = new baseModel({
                lastUpdate: new Date(Date.now()),
                description,
                branch,
                name,
                local,
                number,
                leader: {
                    name: leader.name,
                    id: leader._id,
                },
            });

            return await newBase.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getBase: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { baseID } =  params;
            if (!baseID) return manageError({ code: "invalid_params" });

            const base = await baseModel.findById(baseID);
            if (!base) return manageError({ code: "base_not_found" });

            return base;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserBases: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            return await baseModel.find({ "leader.id": userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateBase: async ({ manageError, params, data }: ManageRequestBody) => {
        try {
            const { baseID } =  params;
            if (!baseID) return manageError({ code: "invalid_params" });

            const base = await baseModel.findById(baseID);
            if (!base) return manageError({ code: "base_not_found" });

            let filteredBase = objectService.filterObject(data, ["createAt", "_id"]);

            if (filteredBase.leader){
                const leader = await hasUser({ _id: filteredBase.leader }, manageError);
                if (!leader) return;

                filteredBase.leader = {
                    name: leader.name,
                    id: leader._id,
                };
            };

            return await baseModel.findByIdAndUpdate(baseID, { $set:{ ...filteredBase, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteClass: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            //if (!manageCheckUserHasPermissions(user, ["manage_space"])) return;

            const usersWithClasses = await userModel.find({ "classes.id": classID });
            for (const classUser of usersWithClasses) {
                classUser.classes.pull({ id: classID });
                await classUser.save();
            };
           
            await classModel.findByIdAndDelete(classID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default baseResource;
