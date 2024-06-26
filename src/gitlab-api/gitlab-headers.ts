import { AxiosRequestConfig } from "axios";
import { labelerConfig } from "../config/get-config";

export const gitlabHeaders: AxiosRequestConfig["headers"] = {
  "PRIVATE-TOKEN": labelerConfig.gitlabAccessToken,
};
