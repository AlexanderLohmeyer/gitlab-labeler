"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.getConfigFromFile = void 0;
const path_1 = __importDefault(require("path"));
const default_config_1 = require("./default-config");
function getGitlabEnv() {
    if (!process.env.GITLAB_ACCESS_TOKEN) {
        throw new Error("Gitlab access token not set. Set GITLAB_ACCESS_TOKEN environment variable.");
    }
    if (!process.env.CI_SERVER_HOST) {
        throw new Error("Gitlab CI Environment variables not set. You propably tried to run this tool outside of Gitlab CI");
    }
    return {
        gitlabAccessToken: process.env.GITLAB_ACCESS_TOKEN,
        gitlabServerHost: process.env.CI_SERVER_HOST,
        gitlabServerProtocoll: process.env.CI_SERVER_PROTOCOL,
        mergeRequestTargetBranch: process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME,
        mergeRequestProjectId: process.env.CI_MERGE_REQUEST_PROJECT_ID,
        mergeRequestIID: process.env.CI_MERGE_REQUEST_IID,
    };
}
function getConfigFromFile() {
    let configFromFile = {};
    try {
        configFromFile = require(path_1.default.resolve("./labeler-config.js"));
    }
    catch (e) { }
    const configFromEnv = Object.assign({ silence: process.env.LABELER_SILENCE === "true", writeComment: process.env.LABELER_WRITE_COMMENT === "true" }, (process.env.LABELER_DETECT_CHANGES
        ? {
            detectChanges: process.env.LABELER_DETECT_CHANGES,
        }
        : {}));
    return Object.assign(Object.assign({}, configFromFile), configFromEnv);
}
exports.getConfigFromFile = getConfigFromFile;
const getConfig = () => (Object.assign(Object.assign(Object.assign({}, default_config_1.defaultConfig), getConfigFromFile()), getGitlabEnv()));
exports.getConfig = getConfig;
