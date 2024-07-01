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
exports.Labeler = exports.FILE_CHANGES_LIMIT = void 0;
const get_config_1 = require("./config/get-config");
const get_labels_to_assign_1 = require("./get-labels-to-assign");
const get_changed_files_1 = require("./git/get-changed-files");
const assign_labels_1 = require("./gitlab-api/assign-labels");
const fetch_changed_files_1 = require("./gitlab-api/fetch-changed-files");
const fetch_mr_details_1 = require("./gitlab-api/fetch-mr-details");
const write_comment_1 = require("./gitlab-api/write-comment");
const logger_1 = require("./logger");
const base_1 = require("./md_templates/base");
const change_entry_1 = require("./md_templates/change-entry");
const list_changes_1 = require("./md_templates/list_changes");
exports.FILE_CHANGES_LIMIT = 20;
class Labeler {
    constructor(labels) {
        this.labels = labels;
        this.labelMatches = [];
    }
    start() {
        return __awaiter(this, arguments, void 0, function* (dryRun = false) {
            let labelsToApply = [];
            let isComplete = false;
            let files = [];
            const alreadyAppliedLabels = yield this.getMrLabels();
            logger_1.logger.log("Filtering for already applied labels...");
            this.labels = this.filterAlreadyAppliedLabels(alreadyAppliedLabels);
            if (this.labels.length === 0) {
                logger_1.logger.log("No labels to apply left.");
                return;
            }
            while (!isComplete) {
                const changesResponse = yield this.getChanges(files.length);
                if (changesResponse.files) {
                    files = [...files, ...changesResponse.files];
                    const labelMatches = (0, get_labels_to_assign_1.getLabelsToAssign)(changesResponse.files, this.labels);
                    this.labelMatches = [...this.labelMatches, ...labelMatches];
                    // No need to check already found Labels again
                    this.labels = this.labels.filter((label) => !labelMatches.find((labelMatch) => labelMatch.regExp === label.regExp));
                    labelsToApply = [
                        ...labelsToApply,
                        ...labelMatches.flatMap((labelMatch) => labelMatch.labels),
                    ];
                }
                isComplete = changesResponse.isComplete;
            }
            if (labelsToApply.length > 0) {
                labelsToApply = [...new Set(labelsToApply)];
                logger_1.logger.log("Applying Labels: " + labelsToApply.join(", "));
                !dryRun && (yield (0, assign_labels_1.assignLabels)(labelsToApply));
                if ((0, get_config_1.getConfigByKey)("writeComment")) {
                    logger_1.logger.log("Writing Comment to Gitlab");
                    try {
                        !dryRun && (yield (0, write_comment_1.writeComment)(this.getComment(files)));
                        logger_1.logger.log("Writing Comment succeeded");
                    }
                    catch (e) {
                        logger_1.logger.error("Writing Comment failed", e);
                    }
                }
                else {
                    logger_1.logger.log("Skip Gitlab Comment");
                }
            }
            else {
                logger_1.logger.log("No Labels to Apply");
            }
        });
    }
    getComment(changedFiles) {
        const base = base_1.BASE_TEMPLATE.replace("{{labelsAddedCount}}", this.labelMatches.length.toString())
            .replace("{{detectChanges}}", (0, get_config_1.getConfigByKey)("detectChanges") === "gitlab-api"
            ? "Gitlab Api"
            : "local Git")
            .replace("{{changedFilesCount}}", changedFiles.length.toString());
        const changeEntries = this.labelMatches.map((labelMatch) => change_entry_1.CHANGE_ENTRY_TEMPLATE.replace("{{labelAdded}}", labelMatch.labels.join(", ")).replace("{{changedFile}}", labelMatch.fileDir));
        const listEntries = list_changes_1.LIST_CHANGES_TEMPLATE.replace("{{changes}}", changeEntries.join("\n"));
        if (this.labelMatches.length > 0) {
            return `
      ${base}
      ${listEntries}
      `;
        }
        return base;
    }
    filterAlreadyAppliedLabels(labels) {
        return this.labels
            .map((labelMap) => {
            labelMap.labelsToAdd = labelMap.labelsToAdd.filter((label) => !labels.includes(label));
            return labelMap;
        })
            .filter((labelMap) => (labelMap === null || labelMap === void 0 ? void 0 : labelMap.labelsToAdd.length) > 0);
    }
    getMrLabels() {
        return __awaiter(this, void 0, void 0, function* () {
            const mrDetails = yield (0, fetch_mr_details_1.fetchMrDetails)();
            return mrDetails.labels;
        });
    }
    getChanges(offset = 0) {
        if ((0, get_config_1.getConfigByKey)("detectChanges") === "gitlab-api") {
            const page = offset / exports.FILE_CHANGES_LIMIT + 1;
            return (0, fetch_changed_files_1.fetchChangedFiles)(page, exports.FILE_CHANGES_LIMIT);
        }
        else {
            return Promise.resolve({
                files: (0, get_changed_files_1.getChangedFiles)(),
                isComplete: true,
            });
        }
    }
}
exports.Labeler = Labeler;
