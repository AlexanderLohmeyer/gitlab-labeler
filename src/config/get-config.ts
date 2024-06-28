import path from "path";
import {
  FullConfig,
  GitlabEnvVariables,
  LabelerConfig,
} from "./config.interface";
import { defaultConfig } from "./default-config";

function getGitlabEnv(): GitlabEnvVariables {
  if (!process.env.GITLAB_ACCESS_TOKEN) {
    throw new Error(
      "Gitlab access token not set. Set GITLAB_ACCESS_TOKEN environment variable."
    );
  }

  if (!process.env.CI_SERVER_HOST) {
    throw new Error(
      "Gitlab CI Environment variables not set. You propably tried to run this tool outside of Gitlab CI"
    );
  }
  return {
    gitlabAccessToken: process.env.GITLAB_ACCESS_TOKEN!,
    gitlabServerHost: process.env.CI_SERVER_HOST!,
    gitlabServerProtocoll: process.env.CI_SERVER_PROTOCOL!,
    mergeRequestTargetBranch: process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME!,
    mergeRequestProjectId: process.env.CI_MERGE_REQUEST_PROJECT_ID!,
    mergeRequestIID: process.env.CI_MERGE_REQUEST_IID!,
  };
}

export function getConfigFromFile(): LabelerConfig {
  let configFromFile: LabelerConfig = {};
  try {
    configFromFile = require(path.resolve("./labeler-config.js"));
  } catch (e) {}

  const configFromEnv: LabelerConfig = {
    silence: process.env.LABELER_SILENCE === "true",
    writeComment: process.env.LABELER_WRITE_COMMENT === "true",
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

export const getConfig = (): Required<FullConfig> => ({
  ...defaultConfig,
  ...getConfigFromFile(),
  ...getGitlabEnv(),
});
