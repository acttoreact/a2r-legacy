# A2R Think tank

This document has no intend to be a clean and organized place. This is just the place where any idea or any wish for the framework should go (unless it goes directly to the official roadmap).

- Include everything needed to make the linter work properly:
  - Settings (through the `.vscode/settings.json` file)
    - File is copied at initialization, but what about possible updates?
  - Libraries
    - Is it possible for a npm package to install dev dependencies?
  - Extensions
    - There is a command to install extensions, we could use it (we need Linter and Prettier extensions for VS Code). More info [here](https://code.visualstudio.com/docs/editor/extension-gallery#_command-line-extension-management).
- Add more commands to `package.json` (test, etc)
- When running on development mode, could be useful to add automatically `displayName` to page components (easier to work with React Chrome dev tools).
