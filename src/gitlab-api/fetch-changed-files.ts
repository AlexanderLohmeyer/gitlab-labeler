import axios from "axios";
import { labelerConfig } from "../config/get-config";
import { getApiBaseUrl } from "./get-api-base-url";
import { gitlabHeaders } from "./gitlab-headers";

type ListMergeRequestDiffsResponse = {
  old_path: string;
  new_path: string;
}[];

export interface ChangedFilesResponse {
  files: string[];
  isComplete: boolean;
}

export async function fetchChangedFiles(
  page: number,
  limit: number
): Promise<ChangedFilesResponse> {
  const response = await axios.get<ListMergeRequestDiffsResponse>(
    `${getApiBaseUrl()}/projects/${
      labelerConfig.mergeRequestProjectId
    }/merge_requests/${labelerConfig.mergeRequestIID}/diffs`,
    {
      headers: gitlabHeaders,
      params: {
        per_page: limit,
        page,
      },
    }
  );

  const files = response.data.flatMap((data) =>
    data.new_path === data.old_path
      ? data.new_path
      : [data.old_path, data.new_path]
  );

  const isComplete = !response.headers["x-next-page"]; // Gitlab returns empty string if no next page is available

  return {
    files,
    isComplete,
  };
}
