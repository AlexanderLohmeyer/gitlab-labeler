export type DirectoriesLabelMapping = [RegExp, string];

export interface LabelerConfig {
  detectChanges?: "git" | "gitlab-api";
  directoriesLabels?: DirectoriesLabelMapping[];
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
