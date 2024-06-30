import axios, { AxiosRequestConfig } from "axios";
import { getGitlabEnv } from "../config/get-config";

function getApiBaseUrl(): string {
  return `${getGitlabEnv().gitlabServerProtocoll}://${
    getGitlabEnv().gitlabServerHost
  }/api/v4`;
}

const gitlabHeaders: AxiosRequestConfig["headers"] = {
  "PRIVATE-TOKEN": getGitlabEnv().gitlabAccessToken,
};

export const gitlabApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: gitlabHeaders,
});
