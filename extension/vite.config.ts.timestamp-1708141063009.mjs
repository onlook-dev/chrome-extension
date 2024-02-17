// vite.config.ts
import { crx } from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import { svelte } from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { defineConfig } from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/vite/dist/node/index.js";

// src/manifest.config.ts
import { defineManifest } from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// package.json
var package_default = {
  name: "onlook.dev",
  description: "Inspect, test, and edit any web app or website online.",
  version: "1.0.6",
  type: "module",
  scripts: {
    dev: "NODE_ENV=development vite build --watch",
    "dev:emulator": "NODE_ENV=development VITE_FIREBASE_EMULATOR=true vite build --watch",
    build: "NODE_ENV=production vite build && npx badlinks dist -r",
    badlinks: "npx badlinks dist -r",
    check: "svelte-check --tsconfig ./tsconfig.json",
    lint: "prettier --plugin-search-dir . --check . && eslint .",
    format: "prettier --plugin-search-dir . --write ."
  },
  devDependencies: {
    "@crxjs/vite-plugin": "2.0.0-beta.18",
    "@happy-dom/global-registrator": "^12.10.3",
    "@sveltejs/vite-plugin-svelte": "^2.4.6",
    "@tsconfig/svelte": "5.0.2",
    "@types/chrome": "0.0.243",
    "@types/mixpanel-browser": "^2.47.5",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    autoprefixer: "^10.4.14",
    eslint: "^8.53.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "eslint-plugin-svelte": "^2.35.0",
    "hot-reload-extension-vite": "^1.0.13",
    postcss: "^8.4.24",
    "postcss-load-config": "^4.0.1",
    prettier: "^3.0.3",
    "prettier-plugin-svelte": "^3.0.3",
    svelte: "^4.2.2",
    "svelte-check": "3.5.0",
    "svelte-preprocess": "5.0.4",
    tailwindcss: "^3.3.2",
    tslib: "2.6.2",
    typescript: "5.2.2",
    "typescript-eslint-parser": "^22.0.0",
    vite: "4.2.3",
    daisyui: "^4.5.0",
    "unplugin-icons": "^0.18.1",
    "@iconify/json": "^2.2.164"
  },
  dependencies: {
    "@extend-chrome/messages": "^1.2.2",
    "@extend-chrome/storage": "^1.5.0",
    "@skeletonlabs/skeleton": "^2.8.0",
    "@types/valid-url": "^1.0.7",
    firebase: "^10.7.1",
    "highlight.js": "^11.9.0",
    "html-to-image": "^1.11.11",
    "mixpanel-browser": "^2.48.1",
    nanoid: "^5.0.3",
    rxjs: "^7.8.1",
    "valid-url": "^1.0.9"
  }
};

// src/manifest.config.ts
var { version, name, description } = package_default;
var [major, minor, patch] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);
var manifest_config_default = defineManifest(async (env) => ({
  manifest_version: 3,
  name,
  description,
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  icons: {
    "16": "src/assets/icons/icon16.png",
    "32": "src/assets/icons/icon32.png",
    "48": "src/assets/icons/icon48.png",
    "128": "src/assets/icons/icon128.png"
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/extension/content/index.ts"],
      run_at: "document_idle"
    }
  ],
  background: {
    service_worker: "src/extension/background/index.ts",
    persistent: true,
    type: "module"
  },
  action: {
    default_popup: "src/extension/popup/popup.html",
    default_icon: {
      "16": "src/assets/icons/icon16.png",
      "32": "src/assets/icons/icon32.png",
      "48": "src/assets/icons/icon48.png",
      "128": "src/assets/icons/icon128.png"
    }
  },
  web_accessible_resources: [
    {
      resources: ["src/lib/editor/*"],
      matches: ["<all_urls>"]
    }
  ],
  commands: {
    _execute_browser_action: {
      suggested_key: {
        windows: "Alt+Shift+D",
        mac: "Alt+Shift+D",
        chromeos: "Alt+Shift+D",
        linux: "Alt+Shift+D"
      }
    }
  },
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0ZbbiZr79FXRJD9Z+jGZsskQstsnkpMHy2yh0HO/udWPFWx/RMjztm/5WQ5p1rIKdBPPZ+xx0WmBZte8OGJ+Ls8MWXo9oUIsKFfxeD8eFNEpaFNKZ6hCvck761/ZXaMN4kCsnwzadR6dTcEoyuPgdUjsrMzDOdCgBgornITel+YfgML6rJb0dBjoTiI1SHGXt5jhO18hjFI9knNtTt2zrQK773YV3fWFKkqCWwWSSlmc0vsivKVgSAie6olRNmV4UyfO7iosFDyA2Q4UoTgMovrwy233OXPi2H24VVXqRYF8wNn1VnakoQWdp+n8zcju+iyPdvjM1w40uv8Hvxnb9wIDAQAB",
  host_permissions: ["<all_urls>"],
  permissions: [
    "tabs",
    "storage",
    "activeTab",
    "contextMenus",
    "scripting"
  ]
}));

// vite.config.ts
import hotReloadExtension from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/hot-reload-extension-vite/dist/main.mjs";
import Icons from "file:///Users/kietho/workplace/onlook/monorepo/extension/node_modules/unplugin-icons/dist/vite.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/kietho/workplace/onlook/monorepo/extension";
var vite_config_default = defineConfig({
  plugins: [
    svelte(),
    Icons({
      compiler: "svelte"
    }),
    crx({ manifest: manifest_config_default }),
    hotReloadExtension({
      log: true,
      backgroundPath: "src/background.index.ts"
      // relative path to background script file
    })
  ],
  // TODO: This is a hack https://github.com/crxjs/chrome-extension-tools/issues/696
  // https://github.com/crxjs/chrome-extension-tools/issues/746
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173
    }
  },
  resolve: {
    alias: {
      $lib: "/src/lib",
      $utils: "/src/lib/utils",
      $shared: path.resolve(__vite_injected_original_dirname, "../shared")
      // Go up one level and then into shared
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LmNvbmZpZy50cyIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva2lldGhvL3dvcmtwbGFjZS9vbmxvb2svbW9ub3JlcG8vZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMva2lldGhvL3dvcmtwbGFjZS9vbmxvb2svbW9ub3JlcG8vZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9raWV0aG8vd29ya3BsYWNlL29ubG9vay9tb25vcmVwby9leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3NyYy9tYW5pZmVzdC5jb25maWcnXG5pbXBvcnQgaG90UmVsb2FkRXh0ZW5zaW9uIGZyb20gJ2hvdC1yZWxvYWQtZXh0ZW5zaW9uLXZpdGUnXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0c3ZlbHRlKCksXG5cdFx0SWNvbnMoe1xuXHRcdFx0Y29tcGlsZXI6ICdzdmVsdGUnXG5cdFx0fSksXG5cdFx0Y3J4KHsgbWFuaWZlc3QgfSksXG5cdFx0aG90UmVsb2FkRXh0ZW5zaW9uKHtcblx0XHRcdGxvZzogdHJ1ZSxcblx0XHRcdGJhY2tncm91bmRQYXRoOiAnc3JjL2JhY2tncm91bmQuaW5kZXgudHMnIC8vIHJlbGF0aXZlIHBhdGggdG8gYmFja2dyb3VuZCBzY3JpcHQgZmlsZVxuXHRcdH0pXG5cdF0sXG5cdC8vIFRPRE86IFRoaXMgaXMgYSBoYWNrIGh0dHBzOi8vZ2l0aHViLmNvbS9jcnhqcy9jaHJvbWUtZXh0ZW5zaW9uLXRvb2xzL2lzc3Vlcy82OTZcblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2NyeGpzL2Nocm9tZS1leHRlbnNpb24tdG9vbHMvaXNzdWVzLzc0NlxuXHRzZXJ2ZXI6IHtcblx0XHRwb3J0OiA1MTczLFxuXHRcdHN0cmljdFBvcnQ6IHRydWUsXG5cdFx0aG1yOiB7XG5cdFx0XHRjbGllbnRQb3J0OiA1MTczXG5cdFx0fVxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCRsaWI6ICcvc3JjL2xpYicsXG5cdFx0XHQkdXRpbHM6ICcvc3JjL2xpYi91dGlscycsXG5cdFx0XHQkc2hhcmVkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc2hhcmVkJykgLy8gR28gdXAgb25lIGxldmVsIGFuZCB0aGVuIGludG8gc2hhcmVkXG5cdFx0fVxuXHR9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva2lldGhvL3dvcmtwbGFjZS9vbmxvb2svbW9ub3JlcG8vZXh0ZW5zaW9uL3NyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2tpZXRoby93b3JrcGxhY2Uvb25sb29rL21vbm9yZXBvL2V4dGVuc2lvbi9zcmMvbWFuaWZlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9raWV0aG8vd29ya3BsYWNlL29ubG9vay9tb25vcmVwby9leHRlbnNpb24vc3JjL21hbmlmZXN0LmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZU1hbmlmZXN0IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4uL3BhY2thZ2UuanNvbidcblxuY29uc3QgeyB2ZXJzaW9uLCBuYW1lLCBkZXNjcmlwdGlvbiB9ID0gcGFja2FnZUpzb25cblxuLy8gQ29udmVydCBmcm9tIFNlbXZlciAoZXhhbXBsZTogMC4xLjAtYmV0YTYpXG5jb25zdCBbbWFqb3IsIG1pbm9yLCBwYXRjaF0gPSB2ZXJzaW9uXG5cdC8vIGNhbiBvbmx5IGNvbnRhaW4gZGlnaXRzLCBkb3RzLCBvciBkYXNoXG5cdC5yZXBsYWNlKC9bXlxcZC4tXSsvZywgJycpXG5cdC8vIHNwbGl0IGludG8gdmVyc2lvbiBwYXJ0c1xuXHQuc3BsaXQoL1suLV0vKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVNYW5pZmVzdChhc3luYyBlbnYgPT4gKHtcblx0bWFuaWZlc3RfdmVyc2lvbjogMyxcblx0bmFtZTogbmFtZSxcblx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuXHR2ZXJzaW9uOiBgJHttYWpvcn0uJHttaW5vcn0uJHtwYXRjaH1gLFxuXHR2ZXJzaW9uX25hbWU6IHZlcnNpb24sXG5cdGljb25zOiB7XG5cdFx0JzE2JzogJ3NyYy9hc3NldHMvaWNvbnMvaWNvbjE2LnBuZycsXG5cdFx0JzMyJzogJ3NyYy9hc3NldHMvaWNvbnMvaWNvbjMyLnBuZycsXG5cdFx0JzQ4JzogJ3NyYy9hc3NldHMvaWNvbnMvaWNvbjQ4LnBuZycsXG5cdFx0JzEyOCc6ICdzcmMvYXNzZXRzL2ljb25zL2ljb24xMjgucG5nJ1xuXHR9LFxuXHRjb250ZW50X3NjcmlwdHM6IFtcblx0XHR7XG5cdFx0XHRtYXRjaGVzOiBbJzxhbGxfdXJscz4nXSxcblx0XHRcdGpzOiBbJ3NyYy9leHRlbnNpb24vY29udGVudC9pbmRleC50cyddLFxuXHRcdFx0cnVuX2F0OiAnZG9jdW1lbnRfaWRsZSdcblx0XHR9XG5cdF0sXG5cdGJhY2tncm91bmQ6IHtcblx0XHRzZXJ2aWNlX3dvcmtlcjogJ3NyYy9leHRlbnNpb24vYmFja2dyb3VuZC9pbmRleC50cycsXG5cdFx0cGVyc2lzdGVudDogdHJ1ZSxcblx0XHR0eXBlOiAnbW9kdWxlJ1xuXHR9LFxuXHRhY3Rpb246IHtcblx0XHRkZWZhdWx0X3BvcHVwOiAnc3JjL2V4dGVuc2lvbi9wb3B1cC9wb3B1cC5odG1sJyxcblx0XHRkZWZhdWx0X2ljb246IHtcblx0XHRcdCcxNic6ICdzcmMvYXNzZXRzL2ljb25zL2ljb24xNi5wbmcnLFxuXHRcdFx0JzMyJzogJ3NyYy9hc3NldHMvaWNvbnMvaWNvbjMyLnBuZycsXG5cdFx0XHQnNDgnOiAnc3JjL2Fzc2V0cy9pY29ucy9pY29uNDgucG5nJyxcblx0XHRcdCcxMjgnOiAnc3JjL2Fzc2V0cy9pY29ucy9pY29uMTI4LnBuZydcblx0XHR9XG5cdH0sXG5cdHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xuXHRcdHtcblx0XHRcdHJlc291cmNlczogWydzcmMvbGliL2VkaXRvci8qJ10sXG5cdFx0XHRtYXRjaGVzOiBbJzxhbGxfdXJscz4nXVxuXHRcdH1cblx0XSxcblx0Y29tbWFuZHM6IHtcblx0XHRfZXhlY3V0ZV9icm93c2VyX2FjdGlvbjoge1xuXHRcdFx0c3VnZ2VzdGVkX2tleToge1xuXHRcdFx0XHR3aW5kb3dzOiAnQWx0K1NoaWZ0K0QnLFxuXHRcdFx0XHRtYWM6ICdBbHQrU2hpZnQrRCcsXG5cdFx0XHRcdGNocm9tZW9zOiAnQWx0K1NoaWZ0K0QnLFxuXHRcdFx0XHRsaW51eDogJ0FsdCtTaGlmdCtEJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0a2V5OiAnTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEwWmJiaVpyNzlGWFJKRDlaK2pHWnNza1FzdHNua3BNSHkyeWgwSE8vdWRXUEZXeC9STWp6dG0vNVdRNXAxcklLZEJQUForeHgwV21CWnRlOE9HSitMczhNV1hvOW9VSXNLRmZ4ZUQ4ZUZORXBhRk5LWjZoQ3Zjazc2MS9aWGFNTjRrQ3Nud3phZFI2ZFRjRW95dVBnZFVqc3JNekRPZENnQmdvcm5JVGVsK1lmZ01MNnJKYjBkQmpvVGlJMVNIR1h0NWpoTzE4aGpGSTlrbk50VHQyenJRSzc3M1lWM2ZXRktrcUNXd1dTU2xtYzB2c2l2S1ZnU0FpZTZvbFJObVY0VXlmTzdpb3NGRHlBMlE0VW9UZ01vdnJ3eTIzM09YUGkySDI0VlZYcVJZRjh3Tm4xVm5ha29RV2RwK244emNqdStpeVBkdmpNMXc0MHV2OEh2eG5iOXdJREFRQUInLFxuXHRob3N0X3Blcm1pc3Npb25zOiBbJzxhbGxfdXJscz4nXSxcblx0cGVybWlzc2lvbnM6IFtcblx0XHQndGFicycsXG5cdFx0J3N0b3JhZ2UnLFxuXHRcdCdhY3RpdmVUYWInLFxuXHRcdCdjb250ZXh0TWVudXMnLFxuXHRcdCdzY3JpcHRpbmcnXG5cdF0gYXMgY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RQZXJtaXNzaW9uc1tdXG59KSlcbiIsICJ7XG4gIFwibmFtZVwiOiBcIm9ubG9vay5kZXZcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkluc3BlY3QsIHRlc3QsIGFuZCBlZGl0IGFueSB3ZWIgYXBwIG9yIHdlYnNpdGUgb25saW5lLlwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuNlwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcIk5PREVfRU5WPWRldmVsb3BtZW50IHZpdGUgYnVpbGQgLS13YXRjaFwiLFxuICAgIFwiZGV2OmVtdWxhdG9yXCI6IFwiTk9ERV9FTlY9ZGV2ZWxvcG1lbnQgVklURV9GSVJFQkFTRV9FTVVMQVRPUj10cnVlIHZpdGUgYnVpbGQgLS13YXRjaFwiLFxuICAgIFwiYnVpbGRcIjogXCJOT0RFX0VOVj1wcm9kdWN0aW9uIHZpdGUgYnVpbGQgJiYgbnB4IGJhZGxpbmtzIGRpc3QgLXJcIixcbiAgICBcImJhZGxpbmtzXCI6IFwibnB4IGJhZGxpbmtzIGRpc3QgLXJcIixcbiAgICBcImNoZWNrXCI6IFwic3ZlbHRlLWNoZWNrIC0tdHNjb25maWcgLi90c2NvbmZpZy5qc29uXCIsXG4gICAgXCJsaW50XCI6IFwicHJldHRpZXIgLS1wbHVnaW4tc2VhcmNoLWRpciAuIC0tY2hlY2sgLiAmJiBlc2xpbnQgLlwiLFxuICAgIFwiZm9ybWF0XCI6IFwicHJldHRpZXIgLS1wbHVnaW4tc2VhcmNoLWRpciAuIC0td3JpdGUgLlwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIjIuMC4wLWJldGEuMThcIixcbiAgICBcIkBoYXBweS1kb20vZ2xvYmFsLXJlZ2lzdHJhdG9yXCI6IFwiXjEyLjEwLjNcIixcbiAgICBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjogXCJeMi40LjZcIixcbiAgICBcIkB0c2NvbmZpZy9zdmVsdGVcIjogXCI1LjAuMlwiLFxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcIjAuMC4yNDNcIixcbiAgICBcIkB0eXBlcy9taXhwYW5lbC1icm93c2VyXCI6IFwiXjIuNDcuNVwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNi4xMC4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjYuMTAuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTRcIixcbiAgICBcImVzbGludFwiOiBcIl44LjUzLjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4wLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tcHJldHRpZXJcIjogXCJeNS4wLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tc3ZlbHRlXCI6IFwiXjIuMzUuMFwiLFxuICAgIFwiaG90LXJlbG9hZC1leHRlbnNpb24tdml0ZVwiOiBcIl4xLjAuMTNcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjI0XCIsXG4gICAgXCJwb3N0Y3NzLWxvYWQtY29uZmlnXCI6IFwiXjQuMC4xXCIsXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjAuM1wiLFxuICAgIFwicHJldHRpZXItcGx1Z2luLXN2ZWx0ZVwiOiBcIl4zLjAuM1wiLFxuICAgIFwic3ZlbHRlXCI6IFwiXjQuMi4yXCIsXG4gICAgXCJzdmVsdGUtY2hlY2tcIjogXCIzLjUuMFwiLFxuICAgIFwic3ZlbHRlLXByZXByb2Nlc3NcIjogXCI1LjAuNFwiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy4zLjJcIixcbiAgICBcInRzbGliXCI6IFwiMi42LjJcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCI1LjIuMlwiLFxuICAgIFwidHlwZXNjcmlwdC1lc2xpbnQtcGFyc2VyXCI6IFwiXjIyLjAuMFwiLFxuICAgIFwidml0ZVwiOiBcIjQuMi4zXCIsXG4gICAgXCJkYWlzeXVpXCI6IFwiXjQuNS4wXCIsXG4gICAgXCJ1bnBsdWdpbi1pY29uc1wiOiBcIl4wLjE4LjFcIixcbiAgICBcIkBpY29uaWZ5L2pzb25cIjogXCJeMi4yLjE2NFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBleHRlbmQtY2hyb21lL21lc3NhZ2VzXCI6IFwiXjEuMi4yXCIsXG4gICAgXCJAZXh0ZW5kLWNocm9tZS9zdG9yYWdlXCI6IFwiXjEuNS4wXCIsXG4gICAgXCJAc2tlbGV0b25sYWJzL3NrZWxldG9uXCI6IFwiXjIuOC4wXCIsXG4gICAgXCJAdHlwZXMvdmFsaWQtdXJsXCI6IFwiXjEuMC43XCIsXG4gICAgXCJmaXJlYmFzZVwiOiBcIl4xMC43LjFcIixcbiAgICBcImhpZ2hsaWdodC5qc1wiOiBcIl4xMS45LjBcIixcbiAgICBcImh0bWwtdG8taW1hZ2VcIjogXCJeMS4xMS4xMVwiLFxuICAgIFwibWl4cGFuZWwtYnJvd3NlclwiOiBcIl4yLjQ4LjFcIixcbiAgICBcIm5hbm9pZFwiOiBcIl41LjAuM1wiLFxuICAgIFwicnhqc1wiOiBcIl43LjguMVwiLFxuICAgIFwidmFsaWQtdXJsXCI6IFwiXjEuMC45XCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVSxTQUFTLFdBQVc7QUFDelYsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsb0JBQW9COzs7QUNGNFQsU0FBUyxzQkFBc0I7OztBQ0F4WDtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsZ0JBQWdCO0FBQUEsSUFDaEIsT0FBUztBQUFBLElBQ1QsVUFBWTtBQUFBLElBQ1osT0FBUztBQUFBLElBQ1QsTUFBUTtBQUFBLElBQ1IsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLHNCQUFzQjtBQUFBLElBQ3RCLGlDQUFpQztBQUFBLElBQ2pDLGdDQUFnQztBQUFBLElBQ2hDLG9CQUFvQjtBQUFBLElBQ3BCLGlCQUFpQjtBQUFBLElBQ2pCLDJCQUEyQjtBQUFBLElBQzNCLG9DQUFvQztBQUFBLElBQ3BDLDZCQUE2QjtBQUFBLElBQzdCLGNBQWdCO0FBQUEsSUFDaEIsUUFBVTtBQUFBLElBQ1YsMEJBQTBCO0FBQUEsSUFDMUIsMEJBQTBCO0FBQUEsSUFDMUIsd0JBQXdCO0FBQUEsSUFDeEIsNkJBQTZCO0FBQUEsSUFDN0IsU0FBVztBQUFBLElBQ1gsdUJBQXVCO0FBQUEsSUFDdkIsVUFBWTtBQUFBLElBQ1osMEJBQTBCO0FBQUEsSUFDMUIsUUFBVTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsSUFDaEIscUJBQXFCO0FBQUEsSUFDckIsYUFBZTtBQUFBLElBQ2YsT0FBUztBQUFBLElBQ1QsWUFBYztBQUFBLElBQ2QsNEJBQTRCO0FBQUEsSUFDNUIsTUFBUTtBQUFBLElBQ1IsU0FBVztBQUFBLElBQ1gsa0JBQWtCO0FBQUEsSUFDbEIsaUJBQWlCO0FBQUEsRUFDbkI7QUFBQSxF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
