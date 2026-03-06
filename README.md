# neutralino.js

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/neutralinojs/neutralino.js)](https://github.com/neutralinojs/neutralino.js/releases)
![npm](https://img.shields.io/npm/v/@neutralinojs/lib)
![npm](https://img.shields.io/npm/dt/@neutralinojs/lib)
[![GitHub last commit](https://img.shields.io/github/last-commit/neutralinojs/neutralino.js.svg)](https://github.com/neutralinojs/neutralino.js/commits/main)
![Build status](https://github.com/neutralinojs/neutralino.js/actions/workflows/ci.yml/badge.svg)

The official JavaScript client for [Neutralinojs](https://github.com/neutralinojs/neutralinojs). Neutralinojs CLI automatically downloads a minified version of `neutralino.js` and lets you use the Neutralinojs native API via the global `Neutralino` JavaScript object (aka `window.Neutralino`). Also, you can download this client from the NPM registry via a Node package manager and bundle with your application:

```bash
npm install @neutralinojs/lib
# --- or ---
yarn add @neutralinojs/lib
```

See Neutralinojs JavaScript API [documentation](https://neutralino.js.org/docs/api/overview) for more details. Release notes are available at [this page](https://neutralino.js.org/docs/release-notes/client-library/). This repository doesn't host the entire Neutralinojs codebase — this is the JavaScript client that Neutralinojs C++ server codebase loads. Browse the Neutralinojs server source code from [this repository](https://github.com/neutralinojs/neutralinojs).

## Developer's FAQ

How to build `neutralino.js` from this repository?

```bash
git clone https://github.com/neutralinojs/neutralino.js.git
cd neutralino.js
npm install
npm run build
```

How to test with the Neutralinojs server?

```bash
cd ../neutralinojs
bash ./bin/script_update_client.sh
./bin/neutralino-{platform}_{arch} --load-dir-res # Eg: ./bin/neutralino-linux_x64 --load-dir-res
```

### License

[MIT](LICENSE)

### Contributing to Neutralinojs

We really appreciate your code contributions. Please read [this contribution guide](https://neutralino.js.org/docs/contributing/framework-developer-guide#contribution-guidelines) before sending a pull request. Thanks for your contributions.

### Contributors

<a href="https://github.com/neutralinojs/neutralino.js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=neutralinojs/neutralino.js" />
</a>

Made with [contributors-img](https://contrib.rocks).


