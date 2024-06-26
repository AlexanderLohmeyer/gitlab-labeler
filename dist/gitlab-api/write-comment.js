"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeComment = void 0;
const axios_1 = __importDefault(require("axios"));
const get_config_1 = require("../config/get-config");
const get_api_base_url_1 = require("./get-api-base-url");
const gitlab_headers_1 = require("./gitlab-headers");
function writeComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(`${(0, get_api_base_url_1.getApiBaseUrl)()}/projects/${get_config_1.labelerConfig.mergeRequestProjectId}/merge_requests/${get_config_1.labelerConfig.mergeRequestIID}/notes`, {
            body: comment,
        }, {
            headers: gitlab_headers_1.gitlabHeaders,
        });
    });
}
exports.writeComment = writeComment;
