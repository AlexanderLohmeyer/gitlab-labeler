import path from "path";
import { getConfigByKey } from "./get-config";
import { LabelerConfig } from "./config.interface";
import { defaultConfig } from "./default-config";

describe("getConfigByKey", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock(
      path.resolve("./labeler-config.js"),
      (): LabelerConfig => ({
        detectChanges: "git",
      }),
      {
        virtual: true,
      }
    );
  });
  it("get value from file", () => {
    const result = getConfigByKey("detectChanges");

    expect(result).toBe("git");
  });

  it("get value from env over file if env isset", () => {
    process.env.LABELER_DETECT_CHANGES = "other-value";

    const result = getConfigByKey("detectChanges");

    expect(result).toBe("other-value");
  });

  it("get default Value if value is not in file", () => {
    const result = getConfigByKey("silence");

    expect(result).toBe(defaultConfig.silence);
  });

  it("should convert string to regex", () => {
    process.env.LABELER_DIRECTORIES_LABELS =
      '[{"regExp":"/([4]).*/g","labelsToAdd":["Dir 4", "Directories","D4"]}]';

    const result = getConfigByKey("directoriesLabels");

    expect(result).toEqual([
      {
        regExp: /([4]).*/g,
        labelsToAdd: ["Dir 4", "Directories", "D4"],
      },
    ]);
  });

  it("should convert string to boolean", () => {
    process.env.LABELER_SILENCE = "true";
    process.env.LABELER_WRITE_COMMENT = "false";

    expect(getConfigByKey("silence")).toBe(true);
    expect(getConfigByKey("writeComment")).toBe(false);
  });
});
