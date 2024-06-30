export type DirectoriesLabelMapping = { regExp: RegExp; labelsToAdd: string[] };

export interface LabelerConfig {
  detectChanges?: "git" | "gitlab-api";
  directoriesLabels?: DirectoriesLabelMapping[];
  silence?: boolean;
  writeComment?: boolean;
}

export interface GitlabEnvVariables {
  gitlabServerHost: string;
  gitlabServerProtocoll: string;
  gitlabAccessToken: string;
  mergeRequestTargetBranch: string;
  mergeRequestProjectId: string;
  mergeRequestIID: string;
}

export type FullConfig = GitlabEnvVariables & LabelerConfig;
