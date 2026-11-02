import { execFileSync } from "child_process";
import { getChangedFiles } from "./get-changed-files";

jest.mock("child_process");

describe("getChangedFiles", () => {
  beforeEach(() => {
    process.env.LABELER_ACCESS_TOKEN = "my_access_token";
    process.env.CI_SERVER_HOST = "my_server_host";
    process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME = "main;rm -rf /";
  });

  it("passes the target branch as argument instead of running it in a shell", () => {
    (execFileSync as jest.Mock).mockReturnValue(Buffer.from("a.ts\nb.ts\n"));

    const result = getChangedFiles();

    expect(execFileSync).toHaveBeenCalledWith("git", [
      "diff",
      "--name-only",
      "origin/main;rm -rf /...HEAD",
    ]);
    expect(result).toEqual(["a.ts", "b.ts"]);
  });
});
