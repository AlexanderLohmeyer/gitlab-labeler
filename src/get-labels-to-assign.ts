import { DirectoriesLabelMapping } from "./config";

export interface LabelerMatch {
  fileDir: string;
  labels: string[];
  regExp: RegExp;
}

export function getLabelsToAssign(
  changes: string[],
  labelDirectories: DirectoriesLabelMapping[]
): LabelerMatch[] {
  const labelMatches = labelDirectories
    .map((testDir) => {
      const match = changes.find((changedFile) =>
        matches(testDir.regExp, changedFile)
      );
      return match
        ? {
            fileDir: match,
            labels: testDir.labelsToAdd,
            regExp: testDir.regExp,
          }
        : undefined;
    })
    .filter(
      (labelMatch: LabelerMatch | undefined): labelMatch is LabelerMatch =>
        !!labelMatch
    );

  return labelMatches;
}

// RegExp.test() with the g or y flag remembers the last position,
// so it has to be reset, otherwise every second file would be skipped
function matches(regExp: RegExp, value: string): boolean {
  regExp.lastIndex = 0;
  return regExp.test(value);
}
