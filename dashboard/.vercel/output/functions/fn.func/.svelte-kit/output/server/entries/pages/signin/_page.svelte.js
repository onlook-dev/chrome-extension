import { c as create_ssr_component, d as spread, f as escape_object, v as validate_component, a as add_attribute } from "../../../chunks/ssr.js";
import { D as DashboardRoutes, S as SUPPORT_LINK } from "../../../chunks/constants.js";
import "firebase/auth";
import "../../../chunks/firebase.js";
import "firebase/firestore";
const Google = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      {
        "data-onlook-id": "~icons/devicon/google.svelte:1:1:1"
      },
      { viewBox: "0 0 128 128" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"/><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"/><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"/><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"/><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div data-onlook-id="src/routes/signin/+page.svelte:21:23:56" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"><div data-onlook-id="src/routes/signin/+page.svelte:24:24:51" class="card border w-96 bg-base-100 shadow-xl"><div data-onlook-id="src/routes/signin/+page.svelte:25:25:50" class="card-body space-y-4"> <div data-onlook-id="src/routes/signin/+page.svelte:27:27:30" class="flex flex-row items-center" data-svelte-h="svelte-6j6tu6"><div data-onlook-id="src/routes/signin/+page.svelte:28:28:28" class="bg-black rounded-full h-4 w-4"></div> <p data-onlook-id="src/routes/signin/+page.svelte:29:29:29" class="ml-2">Onlook</p></div> <h2 data-onlook-id="src/routes/signin/+page.svelte:31:31:31" class="card-title justify-center" data-svelte-h="svelte-11fp0o4">Sign in</h2> <div data-onlook-id="src/routes/signin/+page.svelte:33:33:49" class="form-control space-y-4"><button data-onlook-id="src/routes/signin/+page.svelte:34:40:48" class="btn btn-outline">${`${validate_component(Google, "Google").$$render($$result, { class: "w-4 h-4" }, {}, {})}
						Continue with Google
					`}</button></div></div></div> <div data-onlook-id="src/routes/signin/+page.svelte:52:52:55" class="flex justify-between p-4 space-x-4" data-svelte-h="svelte-1khixn9"><a data-onlook-id="src/routes/signin/+page.svelte:53:53:53"${add_attribute("href", SUPPORT_LINK, 0)} target="_blank" class="link link-hover text-sm">Support</a> <a data-onlook-id="src/routes/signin/+page.svelte:54:54:54"${add_attribute("href", DashboardRoutes.PRIVACY, 0)} target="_blank" class="link link-hover text-sm">Privacy</a></div></div>`;
});
export {
  Page as default
};
