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
    getClass: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });

            return classe;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getClassUsers: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });

            return await userModel.find({ "classes.id": classID }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSpaceClasses: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { spaceID } =  params;
            if (!spaceID) return manageError({ code: "invalid_params" });

            return await classModel.find({ spaceID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateClass: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            //if (!manageCheckUserHasPermissions(user, ["manage_classes", "manage_space"])) return;

            const filteredClass = objectService.filterObject(data, ["createAt", "_id", "space"]);

            if (filteredClass.name){
                filteredClass.name = stringService.normalizeString(filteredClass.name);

                const usersWithClasses = await userModel.find({ "classes.id": classID });
                for (const classUser of usersWithClasses) {
                    const index = classUser.classes.findIndex(classe => String(classe.id) === String(classID));
                    if (index) {
                        classUser.classes[index].name = filteredClass.name;
                        await classUser.save();
                    };
                };
            };

            if (filteredClass.description){
                filteredClass.description = stringService.normalizeString(filteredClass.description);
            };

            return await classModel.findByIdAndUpdate(classID, { $set:{ ...filteredClass, lastUpdate: Date.now() } }, { new: true });
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
