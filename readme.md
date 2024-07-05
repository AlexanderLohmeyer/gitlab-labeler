# Gitlab Labeler

A simple cli tool that automatically labels merge requests in your GitLab repository.

## Installation

To install the Gitlab Labeler, run the following command in your project directory:

```bash
npm install --save-dev gitlab-labeler
```

## Usage

You can easily define label-directory Matches by creating file named`labeler.config.js`in your project directory with the following Content:

```js
module.exports = {
  directoriesLabels: [
    {
      regExp: "path/to/your/directoryg",
      labels: ["your-label"],
    },
    // Add more directory-label pairs as needed
  ],
};
```

To run

```bash
npx gitlab-labeler
```

## Configuration

Its also possible to define Env Variables, which are always priorized and overwrite config Properties from the File. Env variables are always prefixed LABELER\_ and in SNAKE_CASE.

Here is an overview of all possible Configurations:

| Env Variable               | Config Property   | default    | Description                                                                                                                                                    |
| -------------------------- | ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LABELER_ACCESS_TOKEN       | /                 | /          | (required) Access Token for Gitlab-Api access.                                                                                                                 |
| LABELER_DIRECTORIES_LABELS | directoriesLabels | []         | n array of objects that define the mapping between directories and labels. Each object contains a regular expression (regExp) and an array of labels (labels). |
| LABELER_WRITE_COMMENT      | writeComment      | true       | A boolean value that determines whether a comment should be written to the merge request in GitLab.                                                            |
| LABELER_DETECT_CHANGES     | detectChanges     | gitlab-api | A string value that specifies the method used to detect changes in the merge request. It can be set to "gitlab-api" or "local-git".                            |
|                            |                   |            |                                                                                                                                                                |

NOTE: This script is made to be run in CI Context of Gitlab. It consumes some [Gitlab predefined Variables for Merge Requests](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) and won't run without these. To test locally you have to define `CI_SERVER_HOST`, `CI_SERVER_PROTOCOL`, `CI_MERGE_REQUEST_TARGET_BRANCH_NAME`, `CI_MERGE_REQUEST_PROJECT_ID`, `CI_MERGE_REQUEST_IID` on your own.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE) file for more information.
