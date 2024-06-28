import { DirectoriesLabelMapping } from "./config";

export interface LabelMatch {
  fileDir: string;
  label: string;
}

export function getLabelsToAssign(
  changes: string[],
  labelDirectories: DirectoriesLabelMapping[]
): LabelMatch[] {
  const labelMatches = labelDirectories
    .map((testDir) => {
      const match = changes.find((changedFile) => testDir[0].test(changedFile));
      return match ? { fileDir: match, label: testDir[1] } : undefined;
    })
    .filter(
      (labelMatch: LabelMatch | undefined): labelMatch is LabelMatch =>
        !!labelMatch
    );

  return labelMatches;
}
