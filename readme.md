# Gitlab Labeler

A simple cli tool that automatically labels merge requests in your GitLab repository.

## Installation

To install Gitlab Labeler, run the following command in your project directory:

```bash
npm install --save-dev gitlab-labeler
```

## Usage

You can define which labels are added for which changed files by creating a file named `labeler.config.js` in your project directory with the following content:

```js
module.exports = {
  directoriesLabels: [
    {
      regExp: /^path\/to\/your\/directory\//,
      labelsToAdd: ["your-label"],
    },
    // Add more directory-label pairs as needed
  ],
};
```

`regExp` can be a regular expression or a string (e.g. `"^src/frontend/"`). If any changed file matches, all labels in `labelsToAdd` are added to the merge request. The old file name `labeler-config.js` still works.

To run:

```bash
npx gitlab-labeler
```

## Configuration

It's also possible to define environment variables. They always take priority over the properties in the config file. Environment variables are prefixed with `LABELER_` and written in SNAKE_CASE.

Here is an overview of all possible Configurations:

| Env Variable               | Config Property   | default    | Description                                                                                                                                                    |
| -------------------------- | ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LABELER_ACCESS_TOKEN       | /                 | /          | (required) Access Token for Gitlab-Api access.                                                                                                                 |
| LABELER_DIRECTORIES_LABELS | directoriesLabels | []         | An array of objects that define the mapping between directories and labels. Each object contains a regular expression (regExp) and an array of labels (labelsToAdd). As env variable it's a JSON string, e.g. `[{"regExp":"/^src\\//","labelsToAdd":["source"]}]` |
| LABELER_WRITE_COMMENT      | writeComment      | true       | A boolean value that determines whether a comment should be written to the merge request in GitLab.                                                            |
| LABELER_DETECT_CHANGES     | detectChanges     | gitlab-api | A string value that specifies the method used to detect changes in the merge request. It can be set to "gitlab-api" or "git".                                  |
| LABELER_SILENCE            | silence           | false      | Hides the info output. Warnings and errors are still logged.                                                                                                   |

NOTE: This script is made to be run in CI Context of Gitlab. It consumes some [Gitlab predefined Variables for Merge Requests](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) and won't run without these.

When using `detectChanges: "git"`, the target branch has to be available as `origin/<target-branch>` in the CI job, and the history must be deep enough to find the merge base (see `GIT_DEPTH`).

To test locally you have to define `CI_SERVER_HOST`, `CI_SERVER_PROTOCOL`, `CI_MERGE_REQUEST_TARGET_BRANCH_NAME`, `CI_MERGE_REQUEST_PROJECT_ID`, `CI_MERGE_REQUEST_IID` on your own.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
