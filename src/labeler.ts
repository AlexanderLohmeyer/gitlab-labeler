import { DirectoriesLabelMapping } from "./config";
import { getConfig } from "./config/get-config";
import { LabelMatch, getLabelsToAssign } from "./get-labels-to-assign";
import { getChangedFiles } from "./git/get-changed-files";
import { assignLabels } from "./gitlab-api/assign-labels";
import {
  ChangedFilesResponse,
  fetchChangedFiles,
} from "./gitlab-api/fetch-changed-files";
import { writeComment } from "./gitlab-api/write-comment";
import { logger } from "./logger";
import { BASE_TEMPLATE } from "./md_templates/base";
import { CHANGE_ENTRY_TEMPLATE } from "./md_templates/change-entry";
import { LIST_CHANGES_TEMPLATE } from "./md_templates/list_changes";

export const FILE_CHANGES_LIMIT = 20;
type FileDir = string;
type LabelName = string;

export class Labeler {
  private labelMatches: LabelMatch[] = [];

  constructor(private labels: DirectoriesLabelMapping[]) {}

  get config() {
    return getConfig();
  }

  public async start() {
    let labelsToApply: string[] = [];
    let isComplete = false;
    let files: string[] = [];

    while (!isComplete) {
      const changesResponse = await this.getChanges(files.length);

      if (changesResponse.files) {
        files = [...files, ...changesResponse.files];
        const labelMatches = getLabelsToAssign(
          changesResponse.files,
          this.labels
        );

        this.labelMatches = [...this.labelMatches, ...labelMatches];
        // No need to check already found Labels again
        this.labels = this.labels.filter(
          (label) =>
            !labelMatches.find((labelMatch) => labelMatch.label === label[1])
        );

        labelsToApply = [
          ...labelsToApply,
          ...labelMatches.map((labelMatch) => labelMatch.label),
        ];
      }

      isComplete = changesResponse.isComplete;
    }

    if (labelsToApply.length > 0) {
      logger.log("Applying Labels: " + labelsToApply.join(", "));
      await assignLabels(labelsToApply);

      if (this.config.writeComment) {
        logger.log("Writing Comment");
        try {
          await writeComment(this.getComment(files));
          logger.log("Writing Comment succeeded");
        } catch (e) {
          logger.error("Writing Comment failed", e);
        }
      }
    } else {
      logger.log("No Labels to Apply");
    }
  }

  private getComment(changedFiles: string[]): string {
    const base = BASE_TEMPLATE.replace(
      "{{labelsAddedCount}}",
      this.labelMatches.length.toString()
    )
      .replace(
        "{{detectChanges}}",
        this.config.detectChanges === "gitlab-api" ? "Gitlab Api" : "local Git"
      )
      .replace("{{changedFilesCount}}", changedFiles.length.toString());

    const changeEntries: string[] = this.labelMatches.map((labelMatch) =>
      CHANGE_ENTRY_TEMPLATE.replace("{{labelAdded}}", labelMatch.label).replace(
        "{{changedFile}}",
        labelMatch.fileDir
      )
    );

    const listEntries = LIST_CHANGES_TEMPLATE.replace(
      "{{changes}}",
      changeEntries.join("\n")
    );

    if (this.labelMatches.length > 0) {
      return `
      ${base}
      ${listEntries}
      `;
    }

    return base;
  }

  private getChanges(offset = 0): Promise<ChangedFilesResponse> {
    if (this.config.detectChanges === "gitlab-api") {
      const page = offset / FILE_CHANGES_LIMIT + 1;
      return fetchChangedFiles(page, FILE_CHANGES_LIMIT);
    } else {
      return Promise.resolve({
        files: getChangedFiles(),
        isComplete: true,
      });
    }
  }
}
