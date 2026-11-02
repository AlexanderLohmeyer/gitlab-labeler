import fs from "fs";
import path from "path";
import { getConfigByKey } from "./get-config";
import { LabelerConfig } from "./config.interface";
import { defaultConfig } from "./default-config";

const mockConfigFile = (fileName: string, config: any) => {
  jest
    .spyOn(fs, "existsSync")
    .mockImplementation((filePath) => filePath === path.resolve(fileName));
  jest.doMock(path.resolve(fileName), () => config, { virtual: true });
};

describe("getConfigByKey", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockConfigFile("labeler.config.js", {
      detectChanges: "git",
    } as LabelerConfig);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  it("get value from file", () => {
    const result = getConfigByKey("detectChanges");

    expect(result).toBe("git");
  });

  it("get value from legacy config file name", () => {
    mockConfigFile("labeler-config.js", { detectChanges: "git" });

    expect(getConfigByKey("detectChanges")).toBe("git");
  });

  it("get default value if there is no config file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    expect(getConfigByKey("detectChanges")).toBe(defaultConfig.detectChanges);
  });

  it("throws if the config file can't be loaded", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.doMock(
      path.resolve("labeler.config.js"),
      () => {
        throw new SyntaxError("Unexpected token");
      },
      { virtual: true }
    );

    expect(() => getConfigByKey("detectChanges")).toThrow(
      "Could not load config file"
    );
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

  it("should accept strings and RegExp objects in the config file", () => {
    mockConfigFile("labeler.config.js", {
      directoriesLabels: [
        { regExp: "src/frontend", labelsToAdd: ["frontend"] },
        { regExp: /src\/backend/i, labels: ["backend"] },
      ],
    });

    const result = getConfigByKey("directoriesLabels");

    expect(result).toEqual([
      { regExp: /src\/frontend/, labelsToAdd: ["frontend"] },
      { regExp: /src\/backend/i, labelsToAdd: ["backend"] },
    ]);
  });

  it("should convert string to boolean", () => {
    process.env.LABELER_SILENCE = "true";
    process.env.LABELER_WRITE_COMMENT = "false";

    expect(getConfigByKey("silence")).toBe(true);
    expect(getConfigByKey("writeComment")).toBe(false);
  });
});
