"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabHeaders = void 0;
const get_config_1 = require("../config/get-config");
exports.gitlabHeaders = {
    "PRIVATE-TOKEN": get_config_1.labelerConfig.gitlabAccessToken,
};
