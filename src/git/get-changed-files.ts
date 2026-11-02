import { execFileSync } from "child_process";
import { getGitlabEnv } from "../config/get-gitlab-env";

export function getChangedFiles(): string[] {
  const targetBranch = getGitlabEnv().mergeRequestTargetBranch;

  // "..." compares against the merge base, so changes that only happened on the target branch are ignored
  return execFileSync("git", [
    "diff",
    "--name-only",
    `origin/${targetBranch}...HEAD`,
  ])
    .toString()
    .split("\n")
    .filter((file) => file.trim() !== "");
}
