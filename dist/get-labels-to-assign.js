"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsToAssign = void 0;
function getLabelsToAssign(changes, labelDirectories) {
    const labelMatches = labelDirectories
        .map((testDir) => {
        const match = changes.find((changedFile) => matches(testDir.regExp, changedFile));
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
// RegExp.test() with the g or y flag remembers the last position,
// so it has to be reset, otherwise every second file would be skipped
function matches(regExp, value) {
    regExp.lastIndex = 0;
    return regExp.test(value);
}
