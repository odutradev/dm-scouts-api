import { ManageRequestBody } from "@middlewares/manageRequest";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";
import teamModel from "@database/model/team";
import userModel from "@database/model/user";

const teamResource = {
      
    createTeam: async ({ manageError, data }: ManageRequestBody) => {
        try {
          let { name, description, leaderID, branch, group, local } = data;
          if (!name) return manageError({ code: "invalid_data" });
      
          if (description) {
            description = stringService.filterBadwords(stringService.normalizeString(description));
          }
          name = stringService.normalizeString(name);
      
          const leader = await userModel.findOne({ id: leaderID });
          const extra: any = {
            lastUpdate: new Date(),
          };
      
          if (leader) {
            extra.leader = {
              name: leader.name,
              id: leader._id,
            };
            if (leader.group) extra.group = leader.group;
          }
      
          async function generateUniqueNumber() {
            let number;
            while (true) {
              number = Math.floor(Math.random() * 9000) + 1000;
              const exists = await teamModel.findOne({ number });
              if (!exists) break;
            }
            return number;
          }
      
          const uniqueNumber = await generateUniqueNumber();
      
          const newTeam = new teamModel({
            ...extra,
            description,
            branch,
            name,
            group,
            local,
            number: uniqueNumber,
          });
      
          return await newTeam.save();
        } catch (error) {
          manageError({ code: "internal_error", error });
        }
      },    
    getTeam: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { teamID } =  params;
            if (!teamID) return manageError({ code: "invalid_params" });

            const team = await teamModel.findById(teamID);
            if (!team) return manageError({ code: "team_not_found" });

            return team;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getTeamByCode: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { code } =  params;
            if (!code) return manageError({ code: "invalid_params" });

            const team = await teamModel.findOne({ number: code });
            if (!team) return manageError({ code: "team_not_found" });

            return team;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserTeams: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            return await teamModel.find({ "leader.id": userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateTeam: async ({ manageError, params, data }: ManageRequestBody) => {
        try {
            const {teamID } =  params;
            if (!teamID) return manageError({ code: "invalid_params" });

            const team = await teamModel.findById(teamID);
            if (!team) return manageError({ code: "team_not_found" });

            let filteredTeam = objectService.filterObject(data, ["createAt", "_id", "number"]);

            if (filteredTeam.leader){
                const leader = await hasUser({ _id: filteredTeam.leader }, manageError);
                if (!leader) return;

                filteredTeam.leader = {
                    name: leader.name,
                    id: leader._id,
                };
            };

            return await teamModel.findByIdAndUpdate(teamID, { $set:{ ...filteredTeam, lastUpdate: Date.now() } }, { new: true });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    deleteTeam: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { teamID } =  params;
            if (!teamID) return manageError({ code: "invalid_params" });

            const team = await teamModel.findById(teamID);
            if (!team) return manageError({ code: "team_not_found" });

            await teamModel.findByIdAndDelete(teamID);

            return {
                delete: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getAllTeams: async ({ manageError }: ManageRequestBody) => {
        try {
           return await teamModel.find().sort({ date: -1 });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default teamResource;
