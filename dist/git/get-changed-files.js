"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedFiles = void 0;
const child_process_1 = require("child_process");
const get_gitlab_env_1 = require("../config/get-gitlab-env");
function getChangedFiles() {
    const targetBranch = (0, get_gitlab_env_1.getGitlabEnv)().mergeRequestTargetBranch;
    // "..." compares against the merge base, so changes that only happened on the target branch are ignored
    return (0, child_process_1.execFileSync)("git", [
        "diff",
        "--name-only",
        `origin/${targetBranch}...HEAD`,
    ])
        .toString()
        .split("\n")
        .filter((file) => file.trim() !== "");
}
exports.getChangedFiles = getChangedFiles;
