"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabApi = void 0;
const axios_1 = __importDefault(require("axios"));
const get_config_1 = require("../config/get-config");
function getApiBaseUrl() {
    return `${(0, get_config_1.getConfig)().gitlabServerProtocoll}://${(0, get_config_1.getConfig)().gitlabServerHost}/api/v4`;
}
const gitlabHeaders = {
    "PRIVATE-TOKEN": (0, get_config_1.getConfig)().gitlabAccessToken,
};
exports.gitlabApi = axios_1.default.create({
    baseURL: getApiBaseUrl(),
    headers: gitlabHeaders,
});
