import { getGitlabEnv } from "../config/get-gitlab-env";
import { gitlabApi } from "./main";

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
  const response = await gitlabApi.get<ListMergeRequestDiffsResponse>(
    `/projects/${getGitlabEnv().mergeRequestProjectId}/merge_requests/${
      getGitlabEnv().mergeRequestIID
    }/diffs`,
    {
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
