# Changelog

Add all code changes (features, deprecations, and enhancements) under the `Unreleased` topic to track changes for
the next release. Once the changes are released,
rename `Unreleased` topic with the new version tag. Finally, create a new `Unreleased` topic for future changes.

## Unreleased

### API: window.create
- Return process information with the promise.

### API: window.setDraggableRegion
- Allow passing DOM element as the param.

### API: window.unsetDraggableRegion
- Newly introduced method to remove draggable region handlers from an element.

### Improvements
- Make return values of `events`namespace functions consistent.

### Core: Ping on browsers
- Polling action to the server was removed and replaced by server process's internal idle check. `app.keepAlive` was removed.

### Events
- Client-side implementaion of `extensionReady`.
