import fs from "fs";
import path from "path";
import { DirectoriesLabelMapping, LabelerConfig } from "./config.interface";
import { defaultConfig } from "./default-config";

// "labeler.config.js" is the documented name, "labeler-config.js" is kept for backwards compatibility
export const CONFIG_FILE_NAMES = ["labeler.config.js", "labeler-config.js"];

const camelCaseToSnakeCase = (str: string) =>
  str.replace(/([A-Z])/g, "_$1").toLowerCase();

const configFromFile: () => LabelerConfig = () => {
  const configFile = CONFIG_FILE_NAMES.map((fileName) =>
    path.resolve(fileName)
  ).find((filePath) => fs.existsSync(filePath));

  if (!configFile) {
    return {};
  }

  try {
    return require(configFile);
  } catch (e) {
    throw new Error(`Could not load config file ${configFile}: ${e}`);
  }
};

const getConfigPropFromEnv = (key: keyof LabelerConfig): any => {
  const value =
    process.env[`LABELER_${camelCaseToSnakeCase(key).toUpperCase()}`];

  if (value === undefined) {
    return undefined;
  }

  switch (typeof defaultConfig[key]) {
    case "number":
      return +value;
    case "boolean":
      return value === "true";
    case "object":
      return JSON.parse(value);
    default:
      return value;
  }
};

export function toRegExp(value: RegExp | string): RegExp {
  if (value instanceof RegExp) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid regExp in config: ${value}`);
  }

  // Strings like "/src\/.*/i" are parsed including their flags
  const regexParts = value.match(/^\/(.*)\/([gimsuy]*)$/);
  if (regexParts) {
    return new RegExp(regexParts[1], regexParts[2]);
  }

  return new RegExp(value);
}

function normalizeDirectoriesLabels(items: any[]): DirectoriesLabelMapping[] {
  return items.map((item) => ({
    regExp: toRegExp(item.regExp),
    // "labels" is accepted as well, because older versions of the readme used it
    labelsToAdd: item.labelsToAdd ?? item.labels ?? [],
  }));
}

export const getConfigByKey = (key: keyof LabelerConfig) => {
  const value =
    getConfigPropFromEnv(key) ?? configFromFile()[key] ?? defaultConfig[key];

  if (key === "directoriesLabels") {
    return normalizeDirectoriesLabels(value);
  }

  return value;
};
