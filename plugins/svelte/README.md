# Onlook svelte preprocessor

## Usage

1. Install preprocessor library

```bash
npm i --save-dev @onlook/svelte
```

2. Update `svelte.config.js`

```js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Import preprocessor
import { onlookPreprocess } from "@onlook/svelte";
import path from "path";

const config = {
  preprocess: [
    vitePreprocess(),
    // Add preprocessor here
    onlookPreprocess({
      root: path.resolve("."),
    }),
  ],
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

For more, see: https://kit.svelte.dev/docs/configuration
