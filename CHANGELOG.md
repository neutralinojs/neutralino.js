# Changelog

Add all code changes (features, deprecations, and enhancements) under the `Unreleased` topic to track changes for
the next release. Once the changes are released,
rename `Unreleased` topic with the new version tag. Finally, create a new `Unreleased` topic for future changes.

## Unreleased

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
