import { DirectoriesLabelMapping } from "./config";
import { getLabelsToAssign } from "./get-labels-to-assign";

describe("getLabelsToAssign", () => {
  it("should return an empty array if no changes match any label directories", () => {
    const changes: string[] = ["src/file1.js", "src/file2.js"];
    const labelDirectories: DirectoriesLabelMapping[] = [
      [/test\/.*\.spec\.ts$/, "test"],
      [/src\/.*\.tsx?$/, "source"],
    ];

    const result = getLabelsToAssign(changes, labelDirectories);

    expect(result).toEqual([]);
  });

  it("should return an array of LabelMatch objects for matching changes", () => {
    const changes: string[] = ["src/file1.js", "test/file2.spec.ts"];
    const labelDirectories: DirectoriesLabelMapping[] = [
      [/test\/.*\.spec\.ts$/, "test"],
      [/src\/.*\.tsx?$/, "source"],
    ];

    const result = getLabelsToAssign(changes, labelDirectories);

    expect(result).toEqual([{ fileDir: "test/file2.spec.ts", label: "test" }]);
  });

  it("should return an array of LabelMatch objects for multiple matching changes", () => {
    const changes: string[] = [
      "src/file1.js",
      "test/file2.spec.ts",
      "src/file3.tsx",
    ];
    const labelDirectories: DirectoriesLabelMapping[] = [
      [/test\/.*\.spec\.ts$/, "test"],
      [/src\/.*\.tsx?$/, "source"],
    ];

    const result = getLabelsToAssign(changes, labelDirectories);

    expect(result).toEqual([
      { fileDir: "test/file2.spec.ts", label: "test" },
      { fileDir: "src/file3.tsx", label: "source" },
    ]);
  });
});
