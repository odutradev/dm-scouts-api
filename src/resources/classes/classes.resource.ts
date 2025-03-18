/*
import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { UserClassType } from "@utils/types/models/user";
import { hasUser } from "@database/functions/user";
import spaceModel from "@database/model/space";
import classModel from "@database/model/class";
import userModel from "@database/model/user";

const classesResource = {
    createClass: async ({ manageError, data, ids }: ManageRequestBody) => {
        try {
            let { name, description } = data;
            const { userID, spaceID } = ids;
            if (!name || !spaceID) return manageError({ code: "invalid_data" });

            if (description) description = stringService.filterBadwords(stringService.normalizeString(description));
            name = stringService.normalizeString(name);


            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            //if (!manageCheckUserHasPermissions(user, ["manage_classes", "manage_space"])) return;

            const space = await spaceModel.findById(spaceID);
            if (!space) return manageError({ code: "space_not_found" });
            
            const newClass = new classModel({
                lastUpdate: new Date(Date.now()),
                description,
                name,
                metrics: {
                    users: 1
                },
                space: {
                    name: space.name,
                    id: space._id,
                },
            });

            const userClass: UserClassType = {
                entryAt: new Date(Date.now()),
                id: newClass._id.toString(),
                name
            };

            user.classes?.push(userClass);
            
            await userModel.findByIdAndUpdate(userID, { $set:{ ...user, lastUpdate: Date.now() } });

            return await newClass.save()
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
    },
    addClassUser: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            //if (!manageCheckUserHasPermissions(user, ["manage_classes", "manage_space"])) return;

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);

            const invitedUser = await hasUser({ _id: id }, manageError);
            if (!invitedUser) return;

            const hasExistentClass = invitedUser.classes?.find(x => String(x.id) == classID);
            if (hasExistentClass) return manageError({ code: "user_already_in_class"});

            let newClass = {
                entryAt: new Date(),
                name: classe.name,
                id: classe._id
            };
        
            const classes  = [...(invitedUser.classes || []), newClass];

            let classUserMetrics = classe.metrics?.users || 0;

            await classModel.findByIdAndUpdate(classID, { $set:{ metrics: { user: classUserMetrics + 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(invitedUser._id, { $set:{ classes, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return {
                user: updatedUser
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    removeClassUser: async ({ manageError, params, data, ids }: ManageRequestBody) => {
        try {
            const { classID } =  params;
            if (!classID) return manageError({ code: "invalid_params" });

            const classe = await classModel.findById(classID);
            if (!classe) return manageError({ code: "class_not_found" });
            const { userID } = ids;

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            //if (!manageCheckUserHasPermissions(user, ["manage_classes", "manage_space"])) return;

            let { id } = data;
            if (!id) return manageError({ code: "invalid_data" });

            id = stringService.removeSpacesAndLowerCase(id);

            const removedUser = await hasUser({ _id: id }, manageError);
            if (!removedUser) return;

            const hasExistentClass = removedUser.classes?.find(x => String(x.id) == classID);
            if (!hasExistentClass) return manageError({ code: "user_not_in_class" });
        
            const classes = removedUser.classes?.filter(x => String(x.id) != classID);

            let classUserMetrics = classe.metrics?.users || 0;

            await classModel.findByIdAndUpdate(classID, { $set:{ metrics: { user: classUserMetrics - 1 } } }, { new: true });
            
            const updatedUser  = await userModel.findByIdAndUpdate(removedUser._id, { $set:{ classes, lastUpdate: Date.now() } }, { new: true }).select("-password");

            return {
                user: updatedUser
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default classesResource;
*/