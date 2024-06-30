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
        testDir.regExp.test(changedFile)
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
