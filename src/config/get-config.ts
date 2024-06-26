import path from "path";
import {
  FullConfig,
  GitlabEnvVariables,
  LabelerConfig,
} from "./config.interface";
import { defaultConfig } from "./default-config";

function getGitlabEnv(): GitlabEnvVariables {
  return {
    gitlabAccessToken: process.env.GITLAB_ACCESS_TOKEN!,
    gitlabServerHost: process.env.CI_SERVER_HOST!,
    gitlabServerProtocoll: process.env.CI_SERVER_PROTOCOL!,
    mergeRequestTargetBranch: process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME!,
    mergeRequestProjectId: process.env.CI_MERGE_REQUEST_PROJECT_ID!,
    mergeRequestIID: process.env.CI_MERGE_REQUEST_IID!,
  };
}

function getConfig(): LabelerConfig {
  let configFromFile: LabelerConfig = {};
  try {
    configFromFile = require(path.resolve("./labeler-config.js"));
  } catch (e) {}

  const configFromEnv: LabelerConfig = {
    ...(process.env.LABELER_DETECT_CHANGES
      ? {
          detectChanges: process.env.LABELER_DETECT_CHANGES as
            | "git"
            | "gitlab-api",
        }
      : {}),
  };

  return {
    ...configFromFile,
    ...configFromEnv,
  };
}

export const labelerConfig: Required<FullConfig> = {
  ...defaultConfig,
  ...getConfig(),
  ...getGitlabEnv(),
};
