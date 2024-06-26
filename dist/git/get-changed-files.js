"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedFiles = void 0;
const child_process_1 = require("child_process");
const get_config_1 = require("../config/get-config");
function getChangedFiles() {
    return (0, child_process_1.execSync)(`git diff origin/${get_config_1.labelerConfig.mergeRequestTargetBranch} HEAD --name-only`)
        .toString()
        .split("\n");
    // const labelsToAdd = testDirs
    //   .filter((testDir) => test.find((t) => testDir[0].test(t)))
    //   .map((testDir) => testDir[1]);
}
exports.getChangedFiles = getChangedFiles;
