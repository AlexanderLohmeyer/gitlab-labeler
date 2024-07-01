import { getGitlabEnv } from "../config/get-gitlab-env";
import { gitlabApi } from "./main";

export async function assignLabels(labels: string[]) {
  return await gitlabApi.put(
    `projects/${getGitlabEnv().mergeRequestProjectId}/merge_requests/${
      getGitlabEnv().mergeRequestIID
    }`,
    { add_labels: labels.join(",") }
  );
}
