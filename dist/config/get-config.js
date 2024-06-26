"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelerConfig = void 0;
const path_1 = __importDefault(require("path"));
const default_config_1 = require("./default-config");
function getGitlabEnv() {
    return {
        gitlabAccessToken: process.env.GITLAB_ACCESS_TOKEN,
        gitlabServerHost: process.env.CI_SERVER_HOST,
        gitlabServerProtocoll: process.env.CI_SERVER_PROTOCOL,
        mergeRequestTargetBranch: process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME,
        mergeRequestProjectId: process.env.CI_MERGE_REQUEST_PROJECT_ID,
        mergeRequestIID: process.env.CI_MERGE_REQUEST_IID,
    };
}
function getConfig() {
    let configFromFile = {};
    try {
        configFromFile = require(path_1.default.resolve("./labeler-config.js"));
    }
    catch (e) { }
    const configFromEnv = Object.assign({}, (process.env.LABELER_DETECT_CHANGES
        ? {
            detectChanges: process.env.LABELER_DETECT_CHANGES,
        }
        : {}));
    return Object.assign(Object.assign({}, configFromFile), configFromEnv);
}
exports.labelerConfig = Object.assign(Object.assign(Object.assign({}, default_config_1.defaultConfig), getConfig()), getGitlabEnv());
