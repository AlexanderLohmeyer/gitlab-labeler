"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigByKey = void 0;
const path_1 = __importDefault(require("path"));
const default_config_1 = require("./default-config");
const camelCaseToSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();
const configFromFile = () => require(path_1.default.resolve("./labeler-config.js"));
const getConfigPropFromEnv = (key) => {
    const value = process.env[`LABELER_${camelCaseToSnakeCase(key).toUpperCase()}`];
    if (value === undefined) {
        return undefined;
    }
    let output;
    switch (typeof default_config_1.defaultConfig[key]) {
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
        output = output.map((item) => {
            return {
                regExp: stringToRegex(item.regExp),
                labelsToAdd: item.labelsToAdd,
            };
        });
    }
    return output;
};
function stringToRegex(regexString) {
    const regexParts = regexString.match(/^\/(.*?)\/([gimsuy]*)$/);
    if (!regexParts) {
        throw new Error("Invalid regular expression string format");
    }
    return new RegExp(regexParts[1], regexParts[2]);
}
const getConfigByKey = (key) => {
    var _a, _b;
    return ((_b = (_a = getConfigPropFromEnv(key)) !== null && _a !== void 0 ? _a : configFromFile()[key]) !== null && _b !== void 0 ? _b : default_config_1.defaultConfig[key]);
};
exports.getConfigByKey = getConfigByKey;
