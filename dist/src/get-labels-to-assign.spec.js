"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_labels_to_assign_1 = require("./get-labels-to-assign");
describe("getLabelsToAssign", () => {
    it("should return an empty array if no changes match any label directories", () => {
        const changes = ["src/file1.js", "src/file2.js"];
        const labelDirectories = [
            [/test\/.*\.spec\.ts$/, "test"],
            [/src\/.*\.tsx?$/, "source"],
        ];
        const result = (0, get_labels_to_assign_1.getLabelsToAssign)(changes, labelDirectories);
        expect(result).toEqual([]);
    });
    it("should return an array of LabelMatch objects for matching changes", () => {
        const changes = ["src/file1.js", "test/file2.spec.ts"];
        const labelDirectories = [
            [/test\/.*\.spec\.ts$/, "test"],
            [/src\/.*\.tsx?$/, "source"],
        ];
        const result = (0, get_labels_to_assign_1.getLabelsToAssign)(changes, labelDirectories);
        expect(result).toEqual([{ fileDir: "test/file2.spec.ts", label: "test" }]);
    });
    it("should return an array of LabelMatch objects for multiple matching changes", () => {
        const changes = [
            "src/file1.js",
            "test/file2.spec.ts",
            "src/file3.tsx",
        ];
        const labelDirectories = [
            [/test\/.*\.spec\.ts$/, "test"],
            [/src\/.*\.tsx?$/, "source"],
        ];
        const result = (0, get_labels_to_assign_1.getLabelsToAssign)(changes, labelDirectories);
        expect(result).toEqual([
            { fileDir: "test/file2.spec.ts", label: "test" },
            { fileDir: "src/file3.tsx", label: "source" },
        ]);
    });
});
