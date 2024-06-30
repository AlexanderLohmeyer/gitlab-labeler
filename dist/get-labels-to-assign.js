"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsToAssign = void 0;
function getLabelsToAssign(changes, labelDirectories) {
    const labelMatches = labelDirectories
        .map((testDir) => {
        const match = changes.find((changedFile) => testDir.regExp.test(changedFile));
        return match
            ? {
                fileDir: match,
                labels: testDir.labelsToAdd,
                regExp: testDir.regExp,
            }
            : undefined;
    })
        .filter((labelMatch) => !!labelMatch);
    return labelMatches;
}
exports.getLabelsToAssign = getLabelsToAssign;
