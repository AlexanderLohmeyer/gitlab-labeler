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
exports.assignLabels = void 0;
const get_config_1 = require("../config/get-config");
const main_1 = require("./main");
function assignLabels(labels) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield main_1.gitlabApi.put(`projects/${(0, get_config_1.getConfig)().mergeRequestProjectId}/merge_requests/${(0, get_config_1.getConfig)().mergeRequestIID}`, { add_labels: labels.join(",") });
    });
}
exports.assignLabels = assignLabels;
