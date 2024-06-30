import { execSync } from "child_process";
import { getGitlabEnv } from "../config/get-config";

export function getChangedFiles(): string[] {
  return execSync(
    `git diff origin/${
      getGitlabEnv().mergeRequestTargetBranch
    } HEAD --name-only`
  )
    .toString()
    .split("\n");
}
