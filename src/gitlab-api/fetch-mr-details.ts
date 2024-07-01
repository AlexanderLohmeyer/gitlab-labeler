import { getGitlabEnv } from "../config/get-gitlab-env";
import { gitlabApi } from "./main";

export interface MergeRequestDetailsResponse {
  labels: string[];
}

export async function fetchMrDetails() {
  return gitlabApi
    .get<MergeRequestDetailsResponse>(
      `/projects/${getGitlabEnv().mergeRequestProjectId}/merge_requests/${
        getGitlabEnv().mergeRequestIID
      }`
    )
    .then((response) => response.data);
}
