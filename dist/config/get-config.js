"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigByKey = exports.toRegExp = exports.CONFIG_FILE_NAMES = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const default_config_1 = require("./default-config");
// "labeler.config.js" is the documented name, "labeler-config.js" is kept for backwards compatibility
exports.CONFIG_FILE_NAMES = ["labeler.config.js", "labeler-config.js"];
const camelCaseToSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();
const configFromFile = () => {
    const configFile = exports.CONFIG_FILE_NAMES.map((fileName) => path_1.default.resolve(fileName)).find((filePath) => fs_1.default.existsSync(filePath));
    if (!configFile) {
        return {};
    }
    try {
        return require(configFile);
    }
    catch (e) {
        throw new Error(`Could not load config file ${configFile}: ${e}`);
    }
};
const getConfigPropFromEnv = (key) => {
    const value = process.env[`LABELER_${camelCaseToSnakeCase(key).toUpperCase()}`];
    if (value === undefined) {
        return undefined;
    }
    switch (typeof default_config_1.defaultConfig[key]) {
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
function toRegExp(value) {
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
exports.toRegExp = toRegExp;
function normalizeDirectoriesLabels(items) {
    return items.map((item) => {
        var _a, _b;
        return ({
            regExp: toRegExp(item.regExp),
            // "labels" is accepted as well, because older versions of the readme used it
            labelsToAdd: (_b = (_a = item.labelsToAdd) !== null && _a !== void 0 ? _a : item.labels) !== null && _b !== void 0 ? _b : [],
        });
    });
}
const getConfigByKey = (key) => {
    var _a, _b;
    const value = (_b = (_a = getConfigPropFromEnv(key)) !== null && _a !== void 0 ? _a : configFromFile()[key]) !== null && _b !== void 0 ? _b : default_config_1.defaultConfig[key];
    if (key === "directoriesLabels") {
        return normalizeDirectoriesLabels(value);
    }
    return value;
};
exports.getConfigByKey = getConfigByKey;
