import axios from "axios";
import { labelerConfig } from "../config/get-config";
import { getApiBaseUrl } from "./get-api-base-url";
import { gitlabHeaders } from "./gitlab-headers";

export async function assignLabels(labels: string[]) {
  return await axios.put(
    `${getApiBaseUrl()}/projects/${
      labelerConfig.mergeRequestProjectId
    }/merge_requests/${labelerConfig.mergeRequestIID}`,
    { add_labels: labels.join(",") },
    { headers: gitlabHeaders }
  );
}
