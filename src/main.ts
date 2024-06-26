#!/usr/bin/env node
import { labelerConfig } from "./config/get-config";
import { Labeler } from "./labeler";

export async function run(): Promise<void> {
  const labeler = new Labeler(labelerConfig.directoriesLabels);
  labeler.start();

  // const test3 = getTagsToAssign(test2);
  // console.log(test3);
}

run();
