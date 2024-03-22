import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, o as onDestroy, b as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/firebase.js";
import { F as FirebaseService } from "../../../../chunks/index2.js";
import { F as FirestoreCollections } from "../../../../chunks/constants.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  new FirebaseService(FirestoreCollections.PROJECTS);
  $page.url.searchParams.get("installation_id");
  $page.url.searchParams.get("state");
  let errorMessage = "Saving project state failed";
  var CallbackState = /* @__PURE__ */ ((CallbackState2) => {
    CallbackState2[CallbackState2["loading"] = 0] = "loading";
    CallbackState2[CallbackState2["success"] = 1] = "success";
    CallbackState2[CallbackState2["error"] = 2] = "error";
    return CallbackState2;
  })(CallbackState || {});
  let state = 0;
  onDestroy(() => {
  });
  $$unsubscribe_page();
  return `<div data-onlook-id="src/routes/callback/github/+page.svelte:54:56:71" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"><div data-onlook-id="src/routes/callback/github/+page.svelte:57:57:70" class="card border w-96 bg-base-100 shadow-xl"><div data-onlook-id="src/routes/callback/github/+page.svelte:58:58:69" class="card-body space-y-4">${state === CallbackState.loading ? `<div data-onlook-id="src/routes/callback/github/+page.svelte:60:60:63" class="flex flex-row gap-4" data-svelte-h="svelte-uun7k4"><span data-onlook-id="src/routes/callback/github/+page.svelte:61:61:61" class="loading loading-spinner loading-lg"></span> <h1 data-onlook-id="src/routes/callback/github/+page.svelte:62:62:62" class="card-title">Authenticating with Github</h1></div>` : `${state === CallbackState.error ? `<h1 data-onlook-id="src/routes/callback/github/+page.svelte:65:65:65" class="card-title">Error: ${escape(errorMessage)}</h1>` : `<h1 data-onlook-id="src/routes/callback/github/+page.svelte:67:67:67" class="card-title" data-svelte-h="svelte-16je2qu">Github authenticated!<br data-onlook-id="src/routes/callback/github/+page.svelte:67:67:67"></h1>`}`}</div></div></div>`;
});
export {
  Page as default
};
