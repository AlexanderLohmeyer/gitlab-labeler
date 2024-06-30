#!/usr/bin/env node
import yargs from "yargs";
import { getConfigByKey } from "./config/get-config";
import { Labeler } from "./labeler";
import { logger } from "./logger";

export async function run(): Promise<void> {
  const argv = await yargs(process.argv.slice(2)).options({
    "dry-run": { type: "boolean" },
  }).argv;

  logger.log(
    `─────────────────────Gitlab Labeler${
      argv["dry-run"] ? "(Dry-Run)" : ""
    }─────────────────────────`
  );

  const labeler = new Labeler(getConfigByKey("directoriesLabels"));
  labeler.start(argv["dry-run"] as boolean);
}

run();
