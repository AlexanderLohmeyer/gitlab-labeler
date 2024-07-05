"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitlabEnv = void 0;
function getGitlabEnv() {
    var _a;
    if (!process.env.LABELER_ACCESS_TOKEN) {
        throw new Error("Gitlab access token not set. Set LABELER_ACCESS_TOKEN environment variable.");
    }
    if (!process.env.CI_SERVER_HOST) {
        throw new Error("Gitlab CI Environment variables not set. You propably tried to run this tool outside of Gitlab CI");
    }
    return {
        gitlabAccessToken: (_a = process.env.LABELER_ACCESS_TOKEN) !== null && _a !== void 0 ? _a : process.env.GITLAB_ACCESS_TOKEN,
        gitlabServerHost: process.env.CI_SERVER_HOST,
        gitlabServerProtocoll: process.env.CI_SERVER_PROTOCOL,
        mergeRequestTargetBranch: process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME,
        mergeRequestProjectId: process.env.CI_MERGE_REQUEST_PROJECT_ID,
        mergeRequestIID: process.env.CI_MERGE_REQUEST_IID,
    };
}
exports.getGitlabEnv = getGitlabEnv;
