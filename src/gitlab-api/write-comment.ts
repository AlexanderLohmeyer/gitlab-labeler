import axios from "axios";
import { labelerConfig } from "../config/get-config";
import { getApiBaseUrl } from "./get-api-base-url";
import { gitlabHeaders } from "./gitlab-headers";

export async function writeComment(comment: string) {
  await axios.post(
    `${getApiBaseUrl()}/projects/${
      labelerConfig.mergeRequestProjectId
    }/merge_requests/${labelerConfig.mergeRequestIID}/notes`,
    {
      body: comment,
    },
    {
      headers: gitlabHeaders,
    }
  );
}
