import { getConfig } from "../config/get-config";
import { gitlabApi } from "./main";

export async function writeComment(comment: string) {
  return gitlabApi.post(
    `/projects/${getConfig().mergeRequestProjectId}/merge_requests/${
      getConfig().mergeRequestIID
    }/notes`,
    { body: comment }
  );
}
