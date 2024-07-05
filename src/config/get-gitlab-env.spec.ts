import { getGitlabEnv } from "./get-gitlab-env";

describe("getGitlabEnv", () => {
  beforeEach(() => {
    jest.resetModules();

    process.env.LABELER_ACCESS_TOKEN = "my_access_token";
    process.env.CI_SERVER_HOST = "my_server_host";
  });

  it("should return values", () => {
    const result = getGitlabEnv();

    expect(result).toEqual({
      gitlabAccessToken: "my_access_token",
      gitlabServerHost: "my_server_host",
      gitlabServerProtocoll: undefined,
      mergeRequestTargetBranch: undefined,
      mergeRequestProjectId: undefined,
      mergeRequestIID: undefined,
    });
  });

  it("throws an error when LABELER_ACCESS_TOKEN is not set", () => {
    delete process.env.LABELER_ACCESS_TOKEN;
    process.env.CI_SERVER_HOST = "my_server_host";

    expect(() => getGitlabEnv()).toThrow(
      "Gitlab access token not set. Set LABELER_ACCESS_TOKEN environment variable."
    );
  });

  it("throws an error when CI_SERVER_HOST is not set", () => {
    process.env.LABELER_ACCESS_TOKEN = "my_access_token";
    delete process.env.CI_SERVER_HOST;

    expect(() => getGitlabEnv()).toThrow(
      "Gitlab CI Environment variables not set. You propably tried to run this tool outside of Gitlab CI"
    );
  });
});
