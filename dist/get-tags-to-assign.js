"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsToAssign = void 0;
const get_config_1 = require("./config/get-config");
function getTagsToAssign(changes) {
    console.log(get_config_1.labelerConfig.directoriesLabels);
    const testDirs = get_config_1.labelerConfig.directoriesLabels;
    const labelsToAdd = testDirs
        .filter((testDir) => changes.find((t) => testDir[0].test(t)))
        .map((testDir) => testDir[1]);
    return labelsToAdd;
}
exports.getTagsToAssign = getTagsToAssign;
