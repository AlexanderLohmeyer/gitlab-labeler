import { execSync } from "child_process";
import { labelerConfig } from "../config/get-config";

export function getChangedFiles(): string[] {
  return execSync(
    `git diff origin/${labelerConfig.mergeRequestTargetBranch} HEAD --name-only`
  )
    .toString()
    .split("\n");

  // const labelsToAdd = testDirs
  //   .filter((testDir) => test.find((t) => testDir[0].test(t)))
  //   .map((testDir) => testDir[1]);
}
