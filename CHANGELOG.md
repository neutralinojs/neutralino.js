# Changelog

Add all code changes (features, deprecations, and enhancements) under the `Unreleased` topic to track changes for
the next release. Once the changes are released,
rename `Unreleased` topic with the new version tag. Finally, create a new `Unreleased` topic for future changes.

## Unreleased

## v6.0.0

### API: filesystem
- Export `filesystem.getPermissions(path)` and `filesystem.setPermissions(path, permissions, mode)` functions.

### API: os
- Support sending environment variables via `os.execCommand()` and `os.spawnProcess()` functions.

### API: clipboard
- Export `clipboard.readHTML()` and `clipboard.writeHTML(html)` functions.

### Bugfixes/improvements
- Fixing a circular dependency issue in the codebase.
- Several TypeScript-related development fixes.

## v5.6.0

### API: server
- Export `server.mount()`, `server.unmount()`, and `server.getMounts()` functions.

### API: resources
- Export `resources.getStats()` and `resources.extractDirectory()` functions.

### API: window
- Export `window.snapshot()` function.

### API: clipboard
- Add the `format` parameter to the `clipboard.readImage()` function format pixel data. Accepted formats: `rgb`, `rgba`, `argb`, and `bgra`.

### Bugfixes/improvements
- Fix the slow loading issue on Windows by using `127.0.0.1` instead of `localhost`.

## v5.5.0

### Core: initialization
- Support client library source injection

### TypeScript
- Fix some missing type details.

## v5.4.0

### API: resources
- Export `getFiles()`, `extractFile(path, dest)`, `readFile(path)`, and `readBinaryFile(path)` functions.

### API: window
- Export `minimize()`, `unminimize()`, and `isMinimized()` functions.
- Add `alwaysCapture` and `dragMinDistance` options to the `window.setDraggableRegion()` function and improve the performance of the overall draggable window implementation.

### Bugfixes/improvements
- Fix several issues with TypeScript exports and definitions.

## v5.3.0

### API: filesystem
- Expose `filesystem.getAbsolutePath(path)`, `filesystem.getRelativePath(path, ?base)`, and `filesystem.getPathParts(path)` functions.

## v5.2.0

### API: filesystem
- Accept `overwrite`, `skip`, and `recursive` options for the `filesystem.copy()` function.

### Bugfixes/improvements
- Improve the `window.create()` function's option-to-CLI argument mapping logic.

## v5.1.1

### NPM
- Fix the NPM package import issue.

## v5.1.0

### API: clipboard
- Export new framework functions: `clipboard.getFormat()`, `clipboard.readImage()`, and `clipboard.writeImage(image)`.

### TypeScript
- Separate type definitions into a new directory to improve project structure.
- Add missing type definitions.

## v5.0.1

### TypeScript
- Fix type declaration issues with the `window` global object. Now, `window.NL_VERSION`, etc. won't display errors on code editors or with the TypeScript compiler.

## v5.0.0

### API: app
- Expose `app.readProcessInput(readAll=false)`, `app.writeProcessOutput()`, and `app.writeProcessError()` functions.

### API: filesystem
- Export/deprecate functions based on framework's v5 release. See framework changelog for more details.

## v3.13.0

### API: window
- Add `extendUserAgentWith` and `exitProcessOnClose` options to `window.create` TypeScript definition.

## v3.12.0

### Improvements/bugfixes
- Improved the performance of the draggable regions API by throttling Neutralino framework function calls.
- Fix the restarting issue that happens when the app path contains spaces.

## v3.11.0

### API: window
- Avoid saving the window state for child windows in the `window.create` function by using the `--window-use-saved-state=false` internal CLI argument.

## v3.10.0

### API: window
- Export the `window.center` function.

## v3.9.0

### API: file watchers
- Export `filesystem.createWatcher` and `filesystem.removeWatcher` functions.

### DevOps
- Publish to NPM only if there are unreleased changes in changelog.

## v3.8.2

### NPM/ESM support
- Add ESM support for the client library via `neutralino.mjs`.
- Publish (and automate) the client library as an NPM package,`@neutralinojs/lib`.

## v3.8.0

### API: custom methods and file streams
- Expose functions in framework's [custom methods](https://github.com/neutralinojs/neutralinojs/blob/main/CHANGELOG.md#api-custom-methods) and [file streams](https://github.com/neutralinojs/neutralinojs/blob/main/CHANGELOG.md#api-file-streams) implementations.

## v3.7.0

### API: os, filesystem, storage, and computer

- Expose new framework functions: `os.getEnvs`, `storage.getKeys`, and `computer.getMousePosition`.
- Add `size` and `pos` options to `filesystem.readFile` and `filesystem.readBinaryFile` functions.

## v3.6.0

### API: System information API
- Expose the new system information API functions: `computer.getArch`, `computer.getKernelInfo`, `computer.getOSInfo`, `computer.getCPUInfo`, and `computer.getDisplays`.

### API: os
- Add the `defaultPath` option to set the default file path for all file dialogs.

## v3.5.0

### API: filesystem
- Expose `createdAt` and `modifiedAt` JavaScript timestamps with the `filesystem.getStats` function.

### API: os
- Add new functions for spawning processes. `spawnProcess`, `getSpawnedProcesses`, and `updateSpawnedProcess`.

## v3.4.0

### DevOps
- Add nightly builds support. Developers can download the nightly builds by setting `cli.clientVersion` to `nightly`.

### Core: global variables
- Add `NL_CCOMMIT` to hold the release commit of the client library.

## v3.3.0

### API: window

- Add `window.getPosition` to get the current window coordinates.

### API: filesystem
- Add `filesystem.appendFile` to append text content to a file. Thrown errors are similar to the `filesystem.writeFile` function.
- Add `filesystem.appendBinaryFile` to append binary content to a file. Thrown errors are similar to the `filesystem.writeBinaryFile` function.

## v3.2.0

### API: init
- Store `NL_TOKEN` in sessionStorage and handle native API calls after page reload.
- Show a message to the user via HTML if `NL_TOKEN` is not valid (Eg: when the user tries to open the app from another client with `one-time` token).

### API: window
- Add `window.setAlwaysOnTop(bool)`.
- Add `window.getSize`.

## v3.1.0

### API: clipboard
- `clipboard.readText` and `clipboard.writeText` functions added.

## v3.0.0

### Core: Extensions
- Extension API functions. Queue messages dispatched to extensions and send when the extension is ready.

### Core: Init
- Reload app based on `--neu-dev-auto-reload` (`--debug-mode` removed) with the `neuDev_reloadApp` event.

### API: window.create
- Return process information with the promise.

### API: window.setDraggableRegion
- Allow passing DOM element as the param.

### API: window.unsetDraggableRegion
- Newly introduced method to remove draggable region handlers from an element.

### API: Updater
- Updater API functions.

### Improvements
- Make return values of `events` namespace functions consistent.
- Rename `res.neu` to `resources.neu`.

### Core: Ping on browsers
- Polling action to the server was removed and replaced by the server process's internal idle check. `app.keepAlive` was removed.

### Events
- Client-side implementaion of `extensionReady`.
- Allow developers to call native APIs without depending on the `ready` event (it's not removed becuase of the internal usage).
