"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsToAssign = void 0;
function getLabelsToAssign(changes, labelDirectories) {
    const labelMatches = labelDirectories
        .map((testDir) => {
        const match = changes.find((changedFile) => testDir[0].test(changedFile));
        return match ? { fileDir: match, label: testDir[1] } : undefined;
    })
        .filter((labelMatch) => !!labelMatch);
    return labelMatches;
}
exports.getLabelsToAssign = getLabelsToAssign;
