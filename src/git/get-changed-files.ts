import { execSync } from "child_process";
import { getGitlabEnv } from "../config/get-gitlab-env";

export function getChangedFiles(): string[] {
  return execSync(
    `git diff origin/${
      getGitlabEnv().mergeRequestTargetBranch
    } HEAD --name-only`
  )
    .toString()
    .split("\n");
}
