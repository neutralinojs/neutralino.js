# neutralino.js

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/neutralinojs/neutralino.js)](https://github.com/neutralinojs/neutralino.js/releases)
![npm](https://img.shields.io/npm/v/@neutralinojs/lib)
![npm](https://img.shields.io/npm/dt/@neutralinojs/lib)
[![GitHub last commit](https://img.shields.io/github/last-commit/neutralinojs/neutralino.js.svg)](https://github.com/neutralinojs/neutralino.js/commits/main)
![Build status](https://github.com/neutralinojs/neutralino.js/actions/workflows/ci.yml/badge.svg)

The official JavaScript client library for [Neutralinojs](https://github.com/neutralinojs/neutralinojs).

It provides the JavaScript API used by Neutralinojs applications to communicate with the native Neutralinojs server through the global `Neutralino` object, also available as `window.Neutralino`.

This repository contains the **JavaScript client library** for Neutralinojs. It does not contain the complete Neutralinojs codebase. The Neutralinojs C++ server is maintained separately in the [Neutralinojs repository](https://github.com/neutralinojs/neutralinojs).

## Installation

The client library is available through the NPM registry.

Using npm:

```bash
npm install @neutralinojs/lib
```

Using Yarn:

```bash
yarn add @neutralinojs/lib
```

The Neutralinojs CLI also automatically downloads a minified version of `neutralino.js` when setting up a Neutralinojs application.

## Quick Start

### 1. Create a Neutralinojs application

The easiest way to get started is with the Neutralinojs CLI:

```bash
npm install -g @neutralinojs/neu
```

Create a new application:

```bash
neu create my-app
cd my-app
```

Run the application:

```bash
neu run
```

For more information, see the [Neutralinojs documentation](https://neutralino.js.org/docs).

### 2. Use the Neutralino API

Once your application is running, you can use the global `Neutralino` object to access native functionality.

For example, to display a notification:

```javascript
Neutralino.os.showNotification(
  "Hello",
  "Hello from Neutralinojs!"
);
```

You can also listen for Neutralinojs events:

```javascript
Neutralino.events.on("ready", () => {
  console.log("Neutralinojs is ready!");
});
```

For a complete list of available APIs, see the [JavaScript API documentation](https://neutralino.js.org/docs/api/overview).

## Building `neutralino.js`

To build the client library from source:

```bash
git clone https://github.com/neutralinojs/neutralino.js.git
cd neutralino.js
npm install
npm run build
```

## Testing with the Neutralinojs Server

The JavaScript client is loaded by the Neutralinojs C++ server.

To test changes to the client library with the Neutralinojs server, first make sure both repositories are available locally.

From the Neutralinojs server repository, update the client:

```bash
bash ./scripts/update_client.sh
```

Then run the Neutralinojs server for your platform and architecture:

```bash
./bin/neutralino-{platform}_{arch} --load-dir-res
```

For example, on Linux x64:

```bash
./bin/neutralino-linux_x64 --load-dir-res
```

## Documentation

* [Neutralinojs Documentation](https://neutralino.js.org/docs)
* [JavaScript API Documentation](https://neutralino.js.org/docs/api/overview)
* [Client Library Release Notes](https://neutralino.js.org/docs/release-notes/client-library/)

## Contributing

Contributions are welcome!

Before opening a pull request, please read the [contribution guidelines](https://neutralino.js.org/docs/contributing/framework-developer-guide#contribution-guidelines).

Documentation improvements, examples, tests, bug fixes, and other improvements are all welcome.

## License

[MIT](LICENSE)

## Contributors

<a href="https://github.com/neutralinojs/neutralino.js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=neutralinojs/neutralino.js" />
</a>

Made with [contributors-img](https://contributors-img.web.app/).
