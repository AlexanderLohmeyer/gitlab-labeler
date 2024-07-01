export type DirectoriesLabelMapping = { regExp: RegExp; labelsToAdd: string[] };

export interface LabelerConfig {
  detectChanges?: "git" | "gitlab-api";
  directoriesLabels?: DirectoriesLabelMapping[];
  silence?: boolean;
  writeComment?: boolean;
}
