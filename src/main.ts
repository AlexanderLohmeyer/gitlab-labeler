#!/usr/bin/env node
import { getConfig } from "./config/get-config";
import { Labeler } from "./labeler";
import { logger } from "./logger";

export async function run(): Promise<void> {
  logger.log(`─────────────────────Gitlab Labeler─────────────────────────`);

  const labeler = new Labeler(getConfig().directoriesLabels);
  labeler.start();
}

run();
