import { LabelerConfig } from "./config.interface";

export const defaultConfig: Required<LabelerConfig> = {
  detectChanges: "gitlab-api",
  directoriesLabels: [],
  silence: false,
  writeComment: true,
};
