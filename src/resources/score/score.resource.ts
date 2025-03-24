import { ManageRequestBody } from "@middlewares/manageRequest";
import { hasUser } from "@database/functions/user";
import scoreModel from "@database/model/score";
import baseModel from "@database/model/base";
import userModel from "@database/model/user";
import teamModel from "@database/model/team";

const scoreResource = {
    createScore: async ({ manageError, data }: ManageRequestBody) => {
        try {
            let { baseLeaderID, teamLeaderID, baseID, score, extraScore, extraScoreReason, observations, inputIn, outputIn } = data;
            if (!baseLeaderID || !score || !baseID) return manageError({ code: "invalid_data" });

            const extra: any = {
                lastUpdate: new Date(Date.now()),
            };

            const baseLeader = await hasUser({ _id: baseLeaderID }, manageError);
            if (!baseLeader) return;

            const base = await baseModel.findById(baseID);
            if (!base) return manageError({ code: "base_not_found" });

            const teamLeader = await userModel.findById(teamLeaderID);

            if (teamLeader){
                extra.teamLeader = {
                    name: teamLeader.name,
                    id: teamLeader._id,
                };
            };

            const newScore = new scoreModel({
                baseLeader: {
                    name: baseLeader.name,
                    id: baseLeader._id,
                },
                base: {
                    name: base.name,
                    id: base._id
                },
                branch: base.branch,
                local: base.local,
                extraScoreReason,
                type: base.type,
                observations,
                extraScore,
                outputIn,
                inputIn,
                score,
            });

            return await newScore.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getScore: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { scoreID } =  params;
            if (!scoreID) return manageError({ code: "invalid_params" });

            const score = await scoreModel.findById(scoreID);
            if (!score) return manageError({ code: "score_not_found" });

            return score;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserScores: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { userID } =  params;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            return await scoreModel.find({ "teamLeader.id": userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getTeamScores: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { teamID } =  params;
            if (!teamID) return manageError({ code: "invalid_params" });

            const team = await teamModel.findById(teamID);
            if (!team) return manageError({ code: "team_not_found" });

            return await scoreModel.find({ "team.id": teamID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default scoreResource;
