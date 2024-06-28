import { execSync } from "child_process";
import { getConfig } from "../config/get-config";

export function getChangedFiles(): string[] {
  return execSync(
    `git diff origin/${getConfig().mergeRequestTargetBranch} HEAD --name-only`
  )
    .toString()
    .split("\n");
}
