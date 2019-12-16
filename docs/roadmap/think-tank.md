# A2R Think tank

This document has no intend to be a clean and organized place. This is just the place where any idea or any wish for the framework should go (unless it goes directly to the official roadmap).

- Include everything needed to make the linter work properly:
  - Settings (through the `.vscode/settings.json` file)
    - File is copied at initialization, but what about possible updates?
  - Libraries
    - Is it possible for a npm package to install dev dependencies?
  - Extensions
    - There is a command to install extensions, we could use it (we need Linter and Prettier extensions for VS Code). More info [here](https://code.visualstudio.com/docs/editor/extension-gallery#_command-line-extension-management).
- When running on development mode, could be useful to add automatically `displayName` to page components (easier to work with React Chrome dev tools).
- When working on framework, you can use `npm link` in `core` folder and then `npm link a2r` in any project you are using to test the framework. Would be nice to have a command flag so you can init a project this way, which is the best way to test framework features outside the framework without having to publish nor update packages (doesn't work perfectly, but does the job most of the times).

## Commands

List of command that would be nice having:

- build: compile files and run next build (add to package scripts)
- start: run built version (add to package scripts)
- traceSocket: activate client logs on sockets communication
- apiRebuild: rebuilds API
- apiMethodInfo: shows method info based on passed argument
- avoidOpen: avoids opening project on browser

## Enhancements

### Watcher

- [✓] Watcher process should be stronger. Queue should be implemented and improve performance and pending tasks execution. Example: we might save one file multiple times in a short period of time... in these cases watcher shouldn't compile file more than once. Instead of compiling inside the event handler, pending tasks should be added to a queue. Whenever a new task starts being processed, it should check for tasks about same file and remove extra tasks.

## Doubts

- When should we update main libraries like `typescript`? NOTE: On 11th December 2019 I used `npm update`. It updated all packages with available greater version and updated `package.json` except for the packages that had a new major release.
- Add more commands to `package.json` (test, etc) ?
- Should we execute `patch` as part of `update` command? We are copying template contents again, could be some overwrite being done and also some deleted files coming back to life...
