"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = void 0;
const get_config_1 = require("../config/get-config");
function getApiBaseUrl() {
    return `${get_config_1.labelerConfig.gitlabServerProtocoll}://${get_config_1.labelerConfig.gitlabServerHost}/api/v4`;
}
exports.getApiBaseUrl = getApiBaseUrl;
