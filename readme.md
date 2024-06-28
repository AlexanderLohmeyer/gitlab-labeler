# Gitlab Labeler

A simple cli tool that automatically labels merge requests in your GitLab repository.

## Installation

To install the Gitlab Labeler, run the following command in your project directory:

```bash
npm install gitlab-labeler
```

## Usage

You can easily define label-directory Matches by creating file named`labeler.config.js`in your project directory with the following Content:

```js
module.exports = {
  directoriesLabels: [
    {
      directory: "path/to/your/directory",
      label: "your-label",
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

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE) file for more information.
