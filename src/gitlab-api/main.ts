import axios, { AxiosRequestConfig } from "axios";
import { getConfig } from "../config/get-config";

function getApiBaseUrl(): string {
  return `${getConfig().gitlabServerProtocoll}://${
    getConfig().gitlabServerHost
  }/api/v4`;
}

const gitlabHeaders: AxiosRequestConfig["headers"] = {
  "PRIVATE-TOKEN": getConfig().gitlabAccessToken,
};

export const gitlabApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: gitlabHeaders,
});
