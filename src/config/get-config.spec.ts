import path from "path";
import { getConfig } from "./get-config";

describe("getConfig", () => {
  beforeEach(() => {
    jest.resetModules();

    process.env.GITLAB_ACCESS_TOKEN = "my_access_token";
    process.env.CI_SERVER_HOST = "my_server_host";
    jest.mock(
      path.resolve("./labeler-config.js"),
      () => ({
        directoriesLabels: [
          [/([1]).*/g, "Dir 1"],
          [/^package.json$/g, "Dependencies"],
        ],
        detectChanges: "git",
      }),
      { virtual: true }
    );
  });
  test("returns the merged configuration", () => {
    const expectedConfig = {
      gitlabAccessToken: "my_access_token",
      gitlabServerHost: "my_server_host",
      gitlabServerProtocoll: undefined,
      mergeRequestTargetBranch: undefined,
      mergeRequestProjectId: undefined,
      mergeRequestIID: undefined,
      detectChanges: "git",
      directoriesLabels: [
        [/([1]).*/g, "Dir 1"],
        [/^package.json$/g, "Dependencies"],
      ],
    };

    const result = getConfig();

    expect(result).toEqual(expectedConfig);
  });

  it("env variables override config file", () => {
    process.env.LABELER_DETECT_CHANGES = "gitlab-api";

    const expectedConfig = {
      gitlabAccessToken: "my_access_token",
      gitlabServerHost: "my_server_host",
      gitlabServerProtocoll: undefined,
      mergeRequestTargetBranch: undefined,
      mergeRequestProjectId: undefined,
      mergeRequestIID: undefined,
      detectChanges: "gitlab-api",
      directoriesLabels: [
        [/([1]).*/g, "Dir 1"],
        [/^package.json$/g, "Dependencies"],
      ],
    };

    const result = getConfig();

    expect(result).toEqual(expectedConfig);
  });

  test("throws an error when GITLAB_ACCESS_TOKEN is not set", () => {
    delete process.env.GITLAB_ACCESS_TOKEN;
    process.env.CI_SERVER_HOST = "my_server_host";

    expect(() => getConfig()).toThrow(
      "Gitlab access token not set. Set GITLAB_ACCESS_TOKEN environment variable."
    );
  });

  test("throws an error when CI_SERVER_HOST is not set", () => {
    process.env.GITLAB_ACCESS_TOKEN = "my_access_token";
    delete process.env.CI_SERVER_HOST;

    expect(() => getConfig()).toThrow(
      "Gitlab CI Environment variables not set. You propably tried to run this tool outside of Gitlab CI"
    );
  });
});
