import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";
import baseModel from "@database/model/base";

const baseResource = {
    createBase: async ({ manageError, data }: ManageRequestBody) => {
        try {
            let { name, description, leaderID, branch, number, local, type } = data;
            if (!name || !leaderID) return manageError({ code: "invalid_data" });

            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));
            name = stringService.normalizeString(name);

            const leader = await hasUser({ id: leaderID }, manageError);
            if (!leader) return;

            const newBase = new baseModel({
                lastUpdate: new Date(Date.now()),
                type,
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
    deleteBase: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { baseID } =  params;
            if (!baseID) return manageError({ code: "invalid_params" });

            const base = await baseModel.findById(baseID);
            if (!base) return manageError({ code: "base_not_found" });

            await baseModel.findByIdAndDelete(baseID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getAllBases: async ({ manageError }: ManageRequestBody) => {
        try {
           return await baseModel.find().sort({ date: -1 });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default baseResource;
