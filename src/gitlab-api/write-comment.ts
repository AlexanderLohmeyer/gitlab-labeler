import { getGitlabEnv } from "../config/get-config";
import { gitlabApi } from "./main";

export async function writeComment(comment: string) {
  return gitlabApi.post(
    `/projects/${getGitlabEnv().mergeRequestProjectId}/merge_requests/${
      getGitlabEnv().mergeRequestIID
    }/notes`,
    { body: comment }
  );
}
