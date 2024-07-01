import path from "path";
import { DirectoriesLabelMapping, LabelerConfig } from "./config.interface";
import { defaultConfig } from "./default-config";
import { GitlabEnvVariables } from "./gitlab-env.interface";

const camelCaseToSnakeCase = (str: string) =>
  str.replace(/([A-Z])/g, "_$1").toLowerCase();

const configFromFile: () => LabelerConfig = () =>
  require(path.resolve("./labeler-config.js"));

const getConfigPropFromEnv = (key: keyof LabelerConfig): any => {
  const value =
    process.env[`LABELER_${camelCaseToSnakeCase(key).toUpperCase()}`];

  if (value === undefined) {
    return undefined;
  }

  let output: any;

  switch (typeof defaultConfig[key]) {
    case "number":
      output = +value;
      break;
    case "boolean":
      output = value === "true";
      break;
    case "object":
      output = JSON.parse(value);
      break;
    default:
      output = value;
  }

  if (key === "directoriesLabels") {
    output = output.map(
      (item: {
        regExp: string;
        labelsToAdd: string[];
      }): DirectoriesLabelMapping => {
        return {
          regExp: stringToRegex(item.regExp),
          labelsToAdd: item.labelsToAdd,
        };
      }
    );
  }

  return output;
};

function stringToRegex(regexString: string) {
  const regexParts = regexString.match(/^\/(.*?)\/([gimsuy]*)$/);

  if (!regexParts) {
    throw new Error("Invalid regular expression string format");
  }

  return new RegExp(regexParts[1], regexParts[2]);
}

export const getConfigByKey = (key: keyof LabelerConfig) => {
  return (
    getConfigPropFromEnv(key) ?? configFromFile()[key] ?? defaultConfig[key]
  );
};
