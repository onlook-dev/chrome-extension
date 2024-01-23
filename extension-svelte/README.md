# Svelte Typescript Chrome Extension Boilerplate

> Boilerplate for Chrome Extension Svelte Typescript project

## Features

### Frameworks

- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

### Chrome extension

- [Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [CRXJS Vite Plugin](https://github.com/crxjs/chrome-extension-tools/blob/main/packages/vite-plugin/README.md)
- [Chrome storage](https://github.com/extend-chrome/storage)
- [Chrome messaging](https://github.com/extend-chrome/messages)

### Components

- [DaisyUI](https://daisyui.com/components/)
- [Unplugin Icon](https://github.com/unplugin/unplugin-icons/) + [Iconify](https://icon-sets.iconify.design/)

## Development

```bash
# install dependencies
npm i

# build files to `/dist` directory
# HMR for extension pages and content scripts
npm run dev
```

## Build

Run this for publishing. It also runs a lint and [remove remote code execution](https://github.com/spookyuser/badlinks) due to Chrome web store's Blue Argon policy. Make sure nothing breaks after the lint.

```bash
# build files to `/dist` directory
$ npm run build
```

## Load unpacked extensions

[Getting Started Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `LOAD UNPACKED` button and select the `/dist` directory.

![Example](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=571)
