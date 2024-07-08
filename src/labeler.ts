import { DirectoriesLabelMapping } from "./config";
import { getConfigByKey } from "./config/get-config";
import { LabelerMatch, getLabelsToAssign } from "./get-labels-to-assign";
import { getChangedFiles } from "./git/get-changed-files";
import { assignLabels } from "./gitlab-api/assign-labels";
import {
  ChangedFilesResponse,
  fetchChangedFiles,
} from "./gitlab-api/fetch-changed-files";
import { fetchMrDetails } from "./gitlab-api/fetch-mr-details";
import { writeComment } from "./gitlab-api/write-comment";
import { logger } from "./logger";
import { BASE_TEMPLATE } from "./md_templates/base";
import { CHANGE_ENTRY_TEMPLATE } from "./md_templates/change-entry";
import { LIST_CHANGES_TEMPLATE } from "./md_templates/list_changes";

export const FILE_CHANGES_LIMIT = 20;

export class Labeler {
  private labelMatches: LabelerMatch[] = [];

  constructor(private labels: DirectoriesLabelMapping[]) {}

  public async start(dryRun = false) {
    let labelsToApply: string[] = [];
    let isComplete = false;
    let page = 1;
    let files: string[] = [];

    const alreadyAppliedLabels = await this.getMrLabels();
    logger.log("Filtering for already applied labels...");
    this.labels = this.filterAlreadyAppliedLabels(alreadyAppliedLabels);
    if (this.labels.length === 0) {
      logger.log("No labels to apply left.");
      return;
    }

    while (!isComplete) {
      const changesResponse = await this.getChanges(page);

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
            !labelMatches.find(
              (labelMatch) => labelMatch.regExp === label.regExp
            )
        );

        labelsToApply = [
          ...labelsToApply,
          ...labelMatches.flatMap((labelMatch) => labelMatch.labels),
        ];
      }

      isComplete = changesResponse.isComplete;
      if (changesResponse.nextPage) {
        page = changesResponse.nextPage;
      } else {
        page = page + 1;
      }
    }

    if (labelsToApply.length > 0) {
      labelsToApply = [...new Set(labelsToApply)];
      logger.log("Applying Labels: " + labelsToApply.join(", "));
      !dryRun && (await assignLabels(labelsToApply));

      if (getConfigByKey("writeComment")) {
        logger.log("Writing Comment to Gitlab");
        try {
          !dryRun && (await writeComment(this.getComment(files)));
          logger.log("Writing Comment succeeded");
        } catch (e) {
          logger.error("Writing Comment failed", e);
        }
      } else {
        logger.log("Skip Gitlab Comment");
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
        getConfigByKey("detectChanges") === "gitlab-api"
          ? "Gitlab Api"
          : "local Git"
      )
      .replace("{{changedFilesCount}}", changedFiles.length.toString());

    const changeEntries: string[] = this.labelMatches.map((labelMatch) =>
      CHANGE_ENTRY_TEMPLATE.replace(
        "{{labelAdded}}",
        labelMatch.labels.join(", ")
      ).replace("{{changedFile}}", labelMatch.fileDir)
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

  filterAlreadyAppliedLabels(labels: string[]): DirectoriesLabelMapping[] {
    return this.labels
      .map((labelMap) => {
        labelMap.labelsToAdd = labelMap.labelsToAdd.filter(
          (label) => !labels.includes(label)
        );

        return labelMap;
      })
      .filter((labelMap) => labelMap?.labelsToAdd.length > 0);
  }

  async getMrLabels(): Promise<string[]> {
    const mrDetails = await fetchMrDetails();
    return mrDetails.labels;
  }

  private getChanges(page = 1): Promise<ChangedFilesResponse> {
    if (getConfigByKey("detectChanges") === "gitlab-api") {
      return fetchChangedFiles(page, FILE_CHANGES_LIMIT);
    } else {
      return Promise.resolve({
        files: getChangedFiles(),
        isComplete: true,
        nextPage: undefined,
      });
    }
  }
}
