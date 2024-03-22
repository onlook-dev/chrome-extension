import { g as get_store_value, s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, o as onDestroy } from "../../../../../chunks/ssr.js";
import { p as page } from "../../../../../chunks/stores.js";
import { F as FirestoreCollections } from "../../../../../chunks/constants.js";
import { b as usersMapStore, p as projectsMapStore } from "../../../../../chunks/store.js";
import "../../../../../chunks/firebase.js";
import { w as writable, r as readable } from "../../../../../chunks/index.js";
import { F as FirebaseService } from "../../../../../chunks/index2.js";
import "../../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { Octokit } from "@octokit/core";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import "@langchain/openai";
import { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { z } from "zod";
import "@langchain/core/output_parsers/openai_tools";
import "@langchain/core/prompts";
const stores = {};
function localStorageStore(key, initialValue, options) {
  options?.serializer ?? JSON;
  options?.storage ?? "local";
  if (!stores[key]) {
    const store = writable(initialValue, (set2) => {
    });
    const { subscribe: subscribe2, set } = store;
    stores[key] = {
      set(value) {
        set(value);
      },
      update(updater) {
        const value = updater(get_store_value(store));
        set(value);
      },
      subscribe: subscribe2
    };
  }
  return stores[key];
}
localStorageStore("modeOsPrefers", false);
localStorageStore("modeUserPrefers", void 0);
localStorageStore("modeCurrent", false);
function prefersReducedMotion() {
  return false;
}
readable(prefersReducedMotion(), (set) => {
});
Octokit.plugin(retry).plugin(throttling).plugin(restEndpointMethods);
class TranslationTool extends StructuredTool {
  name = "modify_code";
  description = "A tool to modify code based on CSS properties.";
  schema = z.object({
    code: z.string().describe("The modified code chunk with the style changes implemented.")
  });
  async _call(params) {
    return "The answer";
  }
}
convertToOpenAITool(new TranslationTool());
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_usersMapStore;
  let $$unsubscribe_projectsMapStore;
  let $$unsubscribe_page;
  $$unsubscribe_usersMapStore = subscribe(usersMapStore, (value) => value);
  $$unsubscribe_projectsMapStore = subscribe(projectsMapStore, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => value);
  new FirebaseService(FirestoreCollections.PROJECTS);
  new FirebaseService(FirestoreCollections.USERS);
  let unsubs = [];
  onDestroy(() => {
    unsubs.forEach((unsub) => unsub());
  });
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div data-onlook-id="src/routes/dashboard/projects/[id]/+page.svelte:107:107:181" class="flex h-screen w-screen flex-col">${`<div data-onlook-id="src/routes/dashboard/projects/[id]/+page.svelte:176:176:179" class="flex flex-col items-center justify-center h-full" data-svelte-h="svelte-1wuybyo"> <p data-onlook-id="src/routes/dashboard/projects/[id]/+page.svelte:178:178:178" class="text-gray-500">Loading...</p></div>`}</div>`;
  } while (!$$settled);
  $$unsubscribe_usersMapStore();
  $$unsubscribe_projectsMapStore();
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
