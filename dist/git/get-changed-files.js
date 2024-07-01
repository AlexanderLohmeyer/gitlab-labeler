"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedFiles = void 0;
const child_process_1 = require("child_process");
const get_gitlab_env_1 = require("../config/get-gitlab-env");
function getChangedFiles() {
    return (0, child_process_1.execSync)(`git diff origin/${(0, get_gitlab_env_1.getGitlabEnv)().mergeRequestTargetBranch} HEAD --name-only`)
        .toString()
        .split("\n");
}
exports.getChangedFiles = getChangedFiles;
