import { labelerConfig } from "../config/get-config";

export function getApiBaseUrl(): string {
  return `${labelerConfig.gitlabServerProtocoll}://${labelerConfig.gitlabServerHost}/api/v4`;
}
