import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, d as spread, f as escape_object, a as add_attribute, b as escape, v as validate_component, o as onDestroy, e as each } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { T as Tier } from "../../../chunks/firebase.js";
import { F as FirestoreCollections, M as MAX_TITLE_LENGTH } from "../../../chunks/constants.js";
import { p as projectsMapStore, u as userStore, t as teamsMapStore } from "../../../chunks/store.js";
import "firebase/auth";
import "firebase/firestore";
import { F as FirebaseService } from "../../../chunks/index2.js";
import "../../../chunks/stripe.js";
function getInitials(name) {
  const initials = name.split(" ").map((word) => word[0]).join("");
  return initials.toUpperCase();
}
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      {
        "data-onlook-id": "~icons/mdi/chevron-down.svelte:1:1:1"
      },
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const AvatarDropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { user } = $$props;
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  return `<div data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:10:10:41" class="dropdown dropdown-bottom"><div data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:11:15:29" tabindex="0" role="button" class="flex items-center space-x-2 hover:shadow rounded-lg py-2 px-1"><div data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:16:16:27" class="flex items-center space-x-2"><div data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:17:17:25" class="avatar online placeholder"><div data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:18:18:24" class="bg-neutral text-neutral-content rounded-full w-6">${user?.profileImage ? `<img data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:20:20:20"${add_attribute("src", user?.profileImage, 0)} alt="profile">` : `<span data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:22:22:22" class="text-xs">${escape(getInitials(user?.name ?? ""))}</span>`}</div></div> <h2 data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:26:26:26" class="text-sm font-semibold">${escape(user?.name)}</h2></div> ${validate_component(Chevron_down, "ChevronDownIcon").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <ul data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:30:30:40" class="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-52"><li data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:31:31:33" class="disabled" data-svelte-h="svelte-1kvqzkx"><button data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:32:32:32">Profile</button></li> <li data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:34:34:36" class="disabled" data-svelte-h="svelte-1d7uytd"><button data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:35:35:35">Settings</button></li> <li data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:37:37:39" class="text-red-600"><button data-onlook-id="src/routes/dashboard/AvatarDropdown.svelte:38:38:38" data-svelte-h="svelte-1p3mc1l">Sign out</button></li></ul></div>`;
});
const Arrow_up_fill = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      {
        "data-onlook-id": "~icons/mingcute/arrow-up-fill.svelte:1:1:1"
      },
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122z"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const PinImage = "/_app/immutable/assets/tip-pin.hZvOE8Gu.png";
const ProjectsView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $projectsMapStore, $$unsubscribe_projectsMapStore;
  $$unsubscribe_projectsMapStore = subscribe(projectsMapStore, (value) => $projectsMapStore = value);
  let { team } = $$props;
  let unsubs = [];
  const projectService = new FirebaseService(FirestoreCollections.PROJECTS);
  onDestroy(() => {
    unsubs.forEach((unsub) => unsub());
  });
  if ($$props.team === void 0 && $$bindings.team && team !== void 0)
    $$bindings.team(team);
  {
    team?.projectIds.forEach((projectId) => {
      if (!$projectsMapStore.has(projectId)) {
        projectService.subscribe(projectId, (firebaseProject) => {
          projectsMapStore.update((map) => map.set(projectId, firebaseProject));
        }).then((unsubscribe) => {
          unsubs.push(unsubscribe);
        });
      }
    });
  }
  $$unsubscribe_projectsMapStore();
  return `<div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:34:34:87" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">${team?.projectIds.length ? `${each(team?.projectIds.map((id) => $projectsMapStore.get(id)), (project) => {
    return `<button data-onlook-id="src/routes/dashboard/ProjectsView.svelte:37:40:68" class="bg-base-100 rounded space-y-4 p-4 hover:shadow block"><figure data-onlook-id="src/routes/dashboard/ProjectsView.svelte:41:41:51" class="">${project?.hostData.previewImage ? `<img data-onlook-id="src/routes/dashboard/ProjectsView.svelte:43:47:47"${add_attribute("src", project.hostData.previewImage, 0)}${add_attribute("alt", project.name, 0)} class="object-cover object-top aspect-video rounded w-full">` : `<div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:49:49:49" class="bg-gray-100 aspect-video rounded w-full"></div>`}</figure> <div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:52:52:67" class="flex items-center space-x-2"><div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:53:53:62" class="avatar"><div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:54:54:61" class="w-8 mask mask-circle"> ${project?.hostData?.favicon ? `<img data-onlook-id="src/routes/dashboard/ProjectsView.svelte:57:57:57"${add_attribute("src", project.hostData.favicon, 0)} alt="${"Favicon of " + escape(project.hostUrl, true)}">` : `<div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:59:59:59" class="bg-gray-100 rounded-full w-full h-full"></div>`} </div></div> <div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:63:63:66" class="text-left overflow-x-hidden"><p data-onlook-id="src/routes/dashboard/ProjectsView.svelte:64:64:64" class="text-sm font-semibold truncate">${escape(project?.name)}</p> <p data-onlook-id="src/routes/dashboard/ProjectsView.svelte:65:65:65" class="text-xs opacity-70 truncate">${escape(project?.hostUrl)}</p> </div></div> </button>`;
  })}` : ` <div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:72:72:85" class="col-span-full mt-10"><div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:73:73:79" class="absolute top-0 right-0 m-2"> <div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:75:75:78" class="flex flex-col space-y-8">${validate_component(Arrow_up_fill, "ArrowUp").$$render(
    $$result,
    {
      class: "h-6 w-6 absolute top-0 right-[7.5rem] m-2"
    },
    {},
    {}
  )} <span data-onlook-id="src/routes/dashboard/ProjectsView.svelte:77:77:77" class="font-bold" data-svelte-h="svelte-1e3fdcw">Click on extension icon</span></div></div> <p data-onlook-id="src/routes/dashboard/ProjectsView.svelte:80:80:80" class="text-center" data-svelte-h="svelte-94rtme">No projects yet<br data-onlook-id="src/routes/dashboard/ProjectsView.svelte:80:80:80"> Use extension to create project</p> <p data-onlook-id="src/routes/dashboard/ProjectsView.svelte:81:81:81" class="mt-10 text-center" data-svelte-h="svelte-se3xqj"><b data-onlook-id="src/routes/dashboard/ProjectsView.svelte:81:81:81">Tip:</b> Pin the extension for easy access</p> <div data-onlook-id="src/routes/dashboard/ProjectsView.svelte:82:82:84" class="flex justify-center" data-svelte-h="svelte-1ycj0t0"><img data-onlook-id="src/routes/dashboard/ProjectsView.svelte:83:83:83" class="mt-4 h-auto max-w-lg rounded-lg"${add_attribute("src", PinImage, 0)} alt="Pin extension tip"></div></div>`}</div>`;
});
const Side_bar_line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      {
        "data-onlook-id": "~icons/ri/side-bar-line.svelte:1:1:1"
      },
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m5 2H4v14h4zm2 0v14h10V5z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const css = {
  code: "#new-team-modal.svelte-ua4dtb{transition:none !important;animation:none !important}",
  map: null
};
const modalId = "new-team-modal";
const NewTeamModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_userStore;
  $$unsubscribe_userStore = subscribe(userStore, (value) => value);
  new FirebaseService(FirestoreCollections.TEAMS);
  Tier.FREE;
  let teamName = "";
  let nameError = false;
  $$result.css.add(css);
  $$unsubscribe_userStore();
  return `<button data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:67:67:67" data-svelte-h="svelte-p36v5b">+ Create new team</button> <dialog data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:69:69:101"${add_attribute("id", modalId, 0)} class="modal fixed inset-0 flex items-center justify-center svelte-ua4dtb"><div data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:70:70:97" class="modal-box space-y-2"><h3 data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:71:71:71" class="font-bold text-lg mb-4" data-svelte-h="svelte-xdafwl">Create a new team</h3> <div data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:73:73:96" class="flex flex-col space-y-4"><div data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:74:74:87" class="space-y-2"><span data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:75:75:75" class="label-text" data-svelte-h="svelte-1tk4x83">Team name</span> <input data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:76:82:82" type="text" placeholder="Team name" class="${"input input-bordered w-full " + escape(nameError, true)}"${add_attribute("maxlength", MAX_TITLE_LENGTH, 0)}${add_attribute("value", teamName, 0)}> ${``}</div> <div data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:89:89:95" class="modal-action"><form data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:90:90:94" method="dialog"> <button data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:92:92:92" class="btn" data-svelte-h="svelte-vjrizh">Cancel</button> <button data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:93:93:93" class="btn btn-primary" data-svelte-h="svelte-16eehhe">Create</button></form></div></div></div> <form data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:98:98:100" method="dialog" class="modal-backdrop" data-svelte-h="svelte-q8pij0"><button data-onlook-id="src/routes/dashboard/NewTeamModal.svelte:99:99:99">close</button></form> </dialog>`;
});
const dashboardDrawerId = "dashboard-drawer";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  let $teamsMapStore, $$unsubscribe_teamsMapStore;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_teamsMapStore = subscribe(teamsMapStore, (value) => $teamsMapStore = value);
  new FirebaseService(FirestoreCollections.TEAMS);
  new FirebaseService(FirestoreCollections.PAYMENTS);
  let user;
  let activeTeamId = "";
  let unsubs = [];
  onDestroy(() => {
    unsubs.forEach((unsub) => unsub());
  });
  $$unsubscribe_page();
  $$unsubscribe_teamsMapStore();
  return `<div data-onlook-id="src/routes/dashboard/+page.svelte:69:69:134" class="drawer lg:drawer-open"><input data-onlook-id="src/routes/dashboard/+page.svelte:70:70:70"${add_attribute("id", dashboardDrawerId, 0)} type="checkbox" class="drawer-toggle">  <div data-onlook-id="src/routes/dashboard/+page.svelte:72:72:86" class="drawer-content px-4 py-6 overflow-auto h-screen bg-gray-200"> <div data-onlook-id="src/routes/dashboard/+page.svelte:74:74:83" class="flex flex-row gap-2 mb-4 items-center"><label data-onlook-id="src/routes/dashboard/+page.svelte:75:76:77"${add_attribute("for", dashboardDrawerId, 0)} class="btn btn-square btn-ghost drawer-button lg:hidden">${validate_component(Side_bar_line, "SideBarLine").$$render($$result, {}, {}, {})}</label> <div data-onlook-id="src/routes/dashboard/+page.svelte:78:78:82" class="flex flex-row w-full items-center"><h1 data-onlook-id="src/routes/dashboard/+page.svelte:79:79:81" class="text-2xl text-black font-medium">${escape($teamsMapStore.get(activeTeamId)?.name ?? "Unknown team")}</h1></div></div> ${validate_component(ProjectsView, "ProjectsView").$$render($$result, { team: $teamsMapStore.get(activeTeamId) }, {}, {})}</div>  <div data-onlook-id="src/routes/dashboard/+page.svelte:89:89:133" class="drawer-side shadow"><label data-onlook-id="src/routes/dashboard/+page.svelte:90:90:90"${add_attribute("for", dashboardDrawerId, 0)} aria-label="close sidebar" class="drawer-overlay"></label> <ul data-onlook-id="src/routes/dashboard/+page.svelte:91:91:132" class="w-64 min-h-full bg-base-100 space-y-2 p-2"> <li data-onlook-id="src/routes/dashboard/+page.svelte:93:93:95">${validate_component(AvatarDropdown, "AvatarDropdown").$$render($$result, { user }, {}, {})}</li>  <ul data-onlook-id="src/routes/dashboard/+page.svelte:98:98:131" class="menu p-2 space-y-2"> ${``} <li data-onlook-id="src/routes/dashboard/+page.svelte:128:128:130">${validate_component(NewTeamModal, "NewTeamModal").$$render($$result, {}, {}, {})}</li></ul></ul></div></div>`;
});
export {
  Page as default
};
