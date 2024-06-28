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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChangedFiles = void 0;
const get_config_1 = require("../config/get-config");
const main_1 = require("./main");
function fetchChangedFiles(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield main_1.gitlabApi.get(`/projects/${(0, get_config_1.getConfig)().mergeRequestProjectId}/merge_requests/${(0, get_config_1.getConfig)().mergeRequestIID}/diffs`, {
            params: {
                per_page: limit,
                page,
            },
        });
        const files = response.data.flatMap((data) => data.new_path === data.old_path
            ? data.new_path
            : [data.old_path, data.new_path]);
        const isComplete = !response.headers["x-next-page"]; // Gitlab returns empty string if no next page is available
        return {
            files,
            isComplete,
        };
    });
}
exports.fetchChangedFiles = fetchChangedFiles;
