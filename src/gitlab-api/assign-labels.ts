import { getConfig } from "../config/get-config";
import { gitlabApi } from "./main";

export async function assignLabels(labels: string[]) {
  return await gitlabApi.put(
    `projects/${getConfig().mergeRequestProjectId}/merge_requests/${
      getConfig().mergeRequestIID
    }`,
    { add_labels: labels.join(",") }
  );
}
