export const TAILWIND_PROMPT = `Your job is to translate traditional CSS class definitions into Tailwind CSS equivalents. The input will be a json object called changes with an array of objects containing a file path, a string of original CSS classes, and a string representing new CSS properties and their values. The output should be the same changes object mapping to a same array with each json object having the same path and the original CSS classes translated into their Tailwind CSS equivalents based on the provided new CSS properties.
Input object:
- pathInfo: Object; // Information about the file path, keep this the same in output
- classes: string; // A space-separated string of original CSS class names
- newCss: string; // CSS properties and values, formatted as a string

Output object:
- pathInfo: Object; // Information about the file path, keep this the same in output
- classes: string; // A space-separated string of translated Tailwind CSS class names

You should consider the new CSS properties and values to determine the most appropriate Tailwind CSS classes. For example, if the newCss string includes 'margin: 10px;', the corresponding Tailwind class might be 'm-2'. The goal is to create a precise mapping that leverages Tailwind's utility classes effectively.
Please try not to remove any existing classes, and only add new classes if necessary.
`;

const mapBefore = new Map([
  [
    "dashboard/src/routes/dashboard/+page.svelte",
    {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "content": "<script lang=\"ts\">\n\timport { onMount, onDestroy } from 'svelte';\n\timport { goto } from '$app/navigation';\n\timport { page } from '$app/stores';\n\n\timport { auth } from '$lib/firebase/firebase';\n\timport { DashboardRoutes, DashboardSearchParams } from '$shared/constants';\n\timport { paymentsMapStore, teamsMapStore, userStore } from '$lib/utils/store';\n\timport { subscribeToTeam } from '$lib/storage/team';\n\timport type { User } from '$shared/models/user';\n\n\timport AvatarDropdown from './AvatarDropdown.svelte';\n\timport ProjectsView from './ProjectsView.svelte';\n\timport SideBarLine from '~icons/ri/side-bar-line';\n\timport NewTeamModal from './NewTeamModal.svelte';\n\timport PlanModal from './PlanModal.svelte';\n\timport { subscribeToPayment } from '$lib/storage/payment';\n\n\tconst dashboardDrawerId = 'dashboard-drawer';\n\tlet user: User | null;\n\tlet activeTeamId: string = '';\n\tlet unsubs: any[] = [];\n\n\tonMount(async () => {\n\t\t// Get active team from params\n\t\tactiveTeamId = $page.url.searchParams.get(DashboardSearchParams.TEAM) ?? '';\n\n\t\tauth.onAuthStateChanged((user) => {\n\t\t\tif (!user) {\n\t\t\t\tgoto(DashboardRoutes.SIGNIN);\n\t\t\t}\n\t\t});\n\n\t\tuserStore.subscribe((storeUser) => {\n\t\t\tif (!storeUser) return;\n\t\t\tuser = storeUser;\n\t\t\tif (activeTeamId === '' && user?.teamIds.length > 0) {\n\t\t\t\tactiveTeamId = user?.teamIds[0];\n\t\t\t}\n\n\t\t\t// Unsubscribe from previous teams\n\t\t\tunsubs.forEach((unsub: any) => unsub());\n\n\t\t\tuser?.teamIds.forEach((teamId) => {\n\t\t\t\tsubscribeToTeam(teamId, (firebaseTeam) => {\n\t\t\t\t\tteamsMapStore.update((map) => map.set(teamId, firebaseTeam));\n\t\t\t\t\tif (firebaseTeam.paymentId) {\n\t\t\t\t\t\tsubscribeToPayment(firebaseTeam.paymentId, (payment) => {\n\t\t\t\t\t\t\tpaymentsMapStore.update((map) => map.set(payment.id, payment));\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}).then((unsubscribe) => {\n\t\t\t\t\tunsubs.push(unsubscribe);\n\t\t\t\t});\n\t\t\t});\n\t\t});\n\t});\n\n\tonDestroy(() => {\n\t\tunsubs.forEach((unsub: any) => unsub());\n\t});\n</script>\n\n<div class=\"drawer lg:drawer-open\">\n\t<input id={dashboardDrawerId} type=\"checkbox\" class=\"drawer-toggle\" />\n\t<!-- Drawer content -->\n\t<div class=\"bg-black drawer-content px-4 py-6 overflow-auto h-screen\">\n\t\t<!-- Page content here -->\n\t\t<div class=\"flex flex-row gap-2 mb-4 items-center\">\n\t\t\t<label for={dashboardDrawerId} class=\"btn btn-square btn-ghost drawer-button lg:hidden\"\n\t\t\t\t><SideBarLine /></label\n\t\t\t>\n\n\t\t\t<!-- TODO: Change based on folder -->\n\t\t\t<h1 class=\"text-2xl font-bold\">\n\t\t\t\t{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}\n\t\t\t</h1>\n\t\t</div>\n\n\t\t<ProjectsView team={$teamsMapStore.get(activeTeamId)} />\n\t</div>\n\n\t<!-- Drawer Sidebar -->\n\t<div class=\"drawer-side shadow\">\n\t\t<label for={dashboardDrawerId} aria-label=\"close sidebar\" class=\"drawer-overlay\"></label>\n\t\t<ul class=\"w-64 min-h-full bg-base-100 space-y-2 p-2\">\n\t\t\t<!-- Sidebar content -->\n\t\t\t<li>\n\t\t\t\t<AvatarDropdown {user} />\n\t\t\t</li>\n\n\t\t\t<!-- Project folder navigation -->\n\t\t\t<ul class=\"menu p-2 space-y-2\">\n\t\t\t\t<!-- TODO: Make responsive with teamsMapStore-->\n\t\t\t\t{#if user?.teamIds}\n\t\t\t\t\t{#each user?.teamIds as teamId}\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"grid grid-cols-3 items-center w-full\"\n\t\t\t\t\t\t\t\ton:click={() => {\n\t\t\t\t\t\t\t\t\tactiveTeamId = teamId;\n\t\t\t\t\t\t\t\t\tgoto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {\n\t\t\t\t\t\t\t\t\t\treplaceState: true\n\t\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<p\n\t\t\t\t\t\t\t\t\tclass=\"{activeTeamId === teamId\n\t\t\t\t\t\t\t\t\t\t? 'active font-extrabold'\n\t\t\t\t\t\t\t\t\t\t: ''} col-span-2 text-left\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t{#if activeTeamId === teamId}\n\t\t\t\t\t\t\t\t\t<div class=\"col-start-3 justify-self-end\">\n\t\t\t\t\t\t\t\t\t\t<PlanModal {teamId} />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t{/if}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t{/each}\n\t\t\t\t{/if}\n\t\t\t\t<li>\n\t\t\t\t\t<NewTeamModal />\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</ul>\n\t</div>\n</div>\n",
      "sha": "066749c118167be17c2a4ab304962fabbf0a66f4"
    }
  ],
  [
    "dashboard/src/routes/dashboard/ProjectsView.svelte",
    {
      "path": "dashboard/src/routes/dashboard/ProjectsView.svelte",
      "content": "<script lang=\"ts\">\n\timport { goto } from '$app/navigation';\n\timport { onDestroy } from 'svelte';\n\timport { subscribeToProject } from '$lib/storage/project';\n\timport { DashboardRoutes } from '$shared/constants';\n\timport { projectsMapStore } from '$lib/utils/store';\n\timport type { Team } from '$shared/models/team';\n\n\timport ArrowUp from '~icons/mingcute/arrow-up-fill';\n\timport PinImage from '$lib/assets/tip-pin.png';\n\n\texport let team: Team | undefined;\n\tlet unsubs: any[] = [];\n\n\t$: team?.projectIds.forEach((projectId) => {\n\t\tif (!$projectsMapStore.has(projectId)) {\n\t\t\tsubscribeToProject(projectId, (firebaseProject) => {\n\t\t\t\tprojectsMapStore.update((map) => map.set(projectId, firebaseProject));\n\t\t\t}).then((unsubscribe) => {\n\t\t\t\tunsubs.push(unsubscribe);\n\t\t\t});\n\t\t}\n\t});\n\n\tonDestroy(() => {\n\t\tunsubs.forEach((unsub: any) => unsub());\n\t});\n</script>\n\n<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4\">\n\t{#if team?.projectIds.length}\n\t\t{#each team?.projectIds.map((id) => $projectsMapStore.get(id)) as project}\n\t\t\t<button\n\t\t\t\ton:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}\n\t\t\t\tclass=\"bg-base-100 rounded space-y-4 p-4 hover:shadow block\"\n\t\t\t>\n\t\t\t\t<figure class=\"\">\n\t\t\t\t\t{#if project?.hostData.previewImage}\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\tsrc={project.hostData.previewImage}\n\t\t\t\t\t\t\talt={project.name}\n\t\t\t\t\t\t\tclass=\"object-cover object-top aspect-video rounded w-full\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t{:else}\n\t\t\t\t\t\t<div class=\"bg-gray-100 aspect-video rounded w-full\" />\n\t\t\t\t\t{/if}\n\t\t\t\t</figure>\n\t\t\t\t<div class=\"flex items-center space-x-2\">\n\t\t\t\t\t<div class=\"avatar\">\n\t\t\t\t\t\t<div class=\"w-8 mask mask-circle\">\n\t\t\t\t\t\t\t<!-- TODO: Get author from ID -->\n\t\t\t\t\t\t\t{#if project?.hostData?.favicon}\n\t\t\t\t\t\t\t\t<img src={project.hostData.favicon} alt=\"Favicon of {project.hostUrl}\" />\n\t\t\t\t\t\t\t{:else}\n\t\t\t\t\t\t\t\t<div class=\"bg-gray-100 rounded-full w-full h-full\" />\n\t\t\t\t\t\t\t{/if}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"text-left overflow-x-hidden\">\n\t\t\t\t\t\t<p class=\"text-sm font-semibold truncate\">{project?.name}</p>\n\t\t\t\t\t\t<p class=\"text-xs opacity-70 truncate\">{project?.hostUrl}</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t{/each}\n\t{:else}\n\t\t<!-- TODO: Add call to action -->\n\t\t<div class=\"col-span-full mt-10\">\n\t\t\t<div class=\"absolute top-0 right-0 m-2\">\n\t\t\t\t<!-- Arrow container for absolute positioning -->\n\t\t\t\t<div class=\"flex flex-col space-y-8\">\n\t\t\t\t\t<ArrowUp class=\"h-6 w-6 absolute top-0 right-[7.5rem] m-2\" />\n\t\t\t\t\t<span class=\"font-bold\"> Click on extension icon </span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<p class=\"text-center\">No projects yet<br /> Use extension to create project</p>\n\t\t\t<p class=\"mt-10 text-center\"><b>Tip:</b> Pin the extension for easy access</p>\n\t\t\t<div class=\"flex justify-center\">\n\t\t\t\t<img class=\"mt-4 h-auto max-w-lg rounded-lg\" src={PinImage} alt=\"Pin extension tip\" />\n\t\t\t</div>\n\t\t</div>\n\t{/if}\n</div>\n",
      "sha": "90f5af8aea565bd9aa445d12f9bd872172e516a3"
    }
  ]
])

const mapAfter = new Map([
  [
    "dashboard/src/routes/dashboard/ProjectsView.svelte",
    {
      "path": "dashboard/src/routes/dashboard/ProjectsView.svelte",
      "content": "<script lang=\"ts\">\n\timport { goto } from '$app/navigation';\n\timport { onDestroy } from 'svelte';\n\timport { subscribeToProject } from '$lib/storage/project';\n\timport { DashboardRoutes } from '$shared/constants';\n\timport { projectsMapStore } from '$lib/utils/store';\n\timport type { Team } from '$shared/models/team';\n\n\timport ArrowUp from '~icons/mingcute/arrow-up-fill';\n\timport PinImage from '$lib/assets/tip-pin.png';\n\n\texport let team: Team | undefined;\n\tlet unsubs: any[] = [];\n\n\t$: team?.projectIds.forEach((projectId) => {\n\t\tif (!$projectsMapStore.has(projectId)) {\n\t\t\tsubscribeToProject(projectId, (firebaseProject) => {\n\t\t\t\tprojectsMapStore.update((map) => map.set(projectId, firebaseProject));\n\t\t\t}).then((unsubscribe) => {\n\t\t\t\tunsubs.push(unsubscribe);\n\t\t\t});\n\t\t}\n\t});\n\n\tonDestroy(() => {\n\t\tunsubs.forEach((unsub: any) => unsub());\n\t});\n</script>\n\n<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4\">\n\t{#if team?.projectIds.length}\n\t\t{#each team?.projectIds.map((id) => $projectsMapStore.get(id)) as project}\n\t\t\t<button\n\t\t\t\ton:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}\n\t\t\t\tclass=\"bg-base-100 rounded space-y-4 p-4 hover:shadow block\"\n\t\t\t>\n\t\t\t\t<figure class=\"\">\n\t\t\t\t\t{#if project?.hostData.previewImage}\n\t\t\t\t\t\t<img\n\t\t\t\t\t\t\tsrc={project.hostData.previewImage}\n\t\t\t\t\t\t\talt={project.name}\n\t\t\t\t\t\t\tclass=\"object-cover object-top aspect-video rounded w-full\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t{:else}\n\t\t\t\t\t\t<div class=\"bg-gray-100 aspect-video rounded w-full\" />\n\t\t\t\t\t{/if}\n\t\t\t\t</figure>\n\t\t\t\t<div class=\"flex items-center space-x-2\">\n\t\t\t\t\t<div class=\"avatar\">\n\t\t\t\t\t\t<div class=\"w-8 mask mask-circle\">\n\t\t\t\t\t\t\t<!-- TODO: Get author from ID -->\n\t\t\t\t\t\t\t{#if project?.hostData?.favicon}\n\t\t\t\t\t\t\t\t<img src={project.hostData.favicon} alt=\"Favicon of {project.hostUrl}\" />\n\t\t\t\t\t\t\t{:else}\n\t\t\t\t\t\t\t\t<div class=\"bg-gray-100 rounded-full w-full h-full\" />\n\t\t\t\t\t\t\t{/if}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"text-left overflow-x-hidden\">\n\t\t\t\t\t\t<p class=\"text-sm font-light truncate\">{project?.name}</p>\n\t\t\t\t\t\t<p class=\"text-xs opacity-70 truncate\">{project?.hostUrl}</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</button>\n\t\t{/each}\n\t{:else}\n\t\t<!-- TODO: Add call to action -->\n\t\t<div class=\"col-span-full mt-10\">\n\t\t\t<div class=\"absolute top-0 right-0 m-2\">\n\t\t\t\t<!-- Arrow container for absolute positioning -->\n\t\t\t\t<div class=\"flex flex-col space-y-8\">\n\t\t\t\t\t<ArrowUp class=\"h-6 w-6 absolute top-0 right-[7.5rem] m-2\" />\n\t\t\t\t\t<span class=\"font-bold\"> Click on extension icon </span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<p class=\"text-center\">No projects yet<br /> Use extension to create project</p>\n\t\t\t<p class=\"mt-10 text-center\"><b>Tip:</b> Pin the extension for easy access</p>\n\t\t\t<div class=\"flex justify-center\">\n\t\t\t\t<img class=\"mt-4 h-auto max-w-lg rounded-lg\" src={PinImage} alt=\"Pin extension tip\" />\n\t\t\t</div>\n\t\t</div>\n\t{/if}\n</div>\n",
      "sha": "90f5af8aea565bd9aa445d12f9bd872172e516a3"
    }
  ],
  [
    "dashboard/src/routes/dashboard/+page.svelte",
    {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "content": "<script lang=\"ts\">\n\timport { onMount, onDestroy } from 'svelte';\n\timport { goto } from '$app/navigation';\n\timport { page } from '$app/stores';\n\n\timport { auth } from '$lib/firebase/firebase';\n\timport { DashboardRoutes, DashboardSearchParams } from '$shared/constants';\n\timport { paymentsMapStore, teamsMapStore, userStore } from '$lib/utils/store';\n\timport { subscribeToTeam } from '$lib/storage/team';\n\timport type { User } from '$shared/models/user';\n\n\timport AvatarDropdown from './AvatarDropdown.svelte';\n\timport ProjectsView from './ProjectsView.svelte';\n\timport SideBarLine from '~icons/ri/side-bar-line';\n\timport NewTeamModal from './NewTeamModal.svelte';\n\timport PlanModal from './PlanModal.svelte';\n\timport { subscribeToPayment } from '$lib/storage/payment';\n\n\tconst dashboardDrawerId = 'dashboard-drawer';\n\tlet user: User | null;\n\tlet activeTeamId: string = '';\n\tlet unsubs: any[] = [];\n\n\tonMount(async () => {\n\t\t// Get active team from params\n\t\tactiveTeamId = $page.url.searchParams.get(DashboardSearchParams.TEAM) ?? '';\n\n\t\tauth.onAuthStateChanged((user) => {\n\t\t\tif (!user) {\n\t\t\t\tgoto(DashboardRoutes.SIGNIN);\n\t\t\t}\n\t\t});\n\n\t\tuserStore.subscribe((storeUser) => {\n\t\t\tif (!storeUser) return;\n\t\t\tuser = storeUser;\n\t\t\tif (activeTeamId === '' && user?.teamIds.length > 0) {\n\t\t\t\tactiveTeamId = user?.teamIds[0];\n\t\t\t}\n\n\t\t\t// Unsubscribe from previous teams\n\t\t\tunsubs.forEach((unsub: any) => unsub());\n\n\t\t\tuser?.teamIds.forEach((teamId) => {\n\t\t\t\tsubscribeToTeam(teamId, (firebaseTeam) => {\n\t\t\t\t\tteamsMapStore.update((map) => map.set(teamId, firebaseTeam));\n\t\t\t\t\tif (firebaseTeam.paymentId) {\n\t\t\t\t\t\tsubscribeToPayment(firebaseTeam.paymentId, (payment) => {\n\t\t\t\t\t\t\tpaymentsMapStore.update((map) => map.set(payment.id, payment));\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}).then((unsubscribe) => {\n\t\t\t\t\tunsubs.push(unsubscribe);\n\t\t\t\t});\n\t\t\t});\n\t\t});\n\t});\n\n\tonDestroy(() => {\n\t\tunsubs.forEach((unsub: any) => unsub());\n\t});\n</script>\n\n<div class=\"drawer lg:drawer-open\">\n\t<input id={dashboardDrawerId} type=\"checkbox\" class=\"drawer-toggle\" />\n\t<!-- Drawer content -->\n\t<div class=\"bg-black drawer-content px-4 py-6 overflow-auto h-screen bg-black\">\n\t\t<!-- Page content here -->\n\t\t<div class=\"flex flex-row gap-2 mb-4 items-center\">\n\t\t\t<label for={dashboardDrawerId} class=\"btn btn-square btn-ghost drawer-button lg:hidden\"\n\t\t\t\t><SideBarLine /></label\n\t\t\t>\n\n\t\t\t<!-- TODO: Change based on folder -->\n\t\t\t<h1 class=\"text-2xl font-bold bg-red-500 pb-10 text-white font-light pt-10 pl-10\">\n\t\t\t\t{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}\n\t\t\t</h1>\n\t\t</div>\n\n\t\t<ProjectsView team={$teamsMapStore.get(activeTeamId)} />\n\t</div>\n\n\t<!-- Drawer Sidebar -->\n\t<div class=\"drawer-side shadow\">\n\t\t<label for={dashboardDrawerId} aria-label=\"close sidebar\" class=\"drawer-overlay\"></label>\n\t\t<ul class=\"w-64 min-h-full bg-green-500 space-y-2 p-2 bg-green-500\">\n\t\t\t<!-- Sidebar content -->\n\t\t\t<li>\n\t\t\t\t<AvatarDropdown {user} />\n\t\t\t</li>\n\n\t\t\t<!-- Project folder navigation -->\n\t\t\t<ul class=\"menu p-2 space-y-2\">\n\t\t\t\t<!-- TODO: Make responsive with teamsMapStore-->\n\t\t\t\t{#if user?.teamIds}\n\t\t\t\t\t{#each user?.teamIds as teamId}\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"grid grid-cols-3 items-center w-full\"\n\t\t\t\t\t\t\t\ton:click={() => {\n\t\t\t\t\t\t\t\t\tactiveTeamId = teamId;\n\t\t\t\t\t\t\t\t\tgoto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {\n\t\t\t\t\t\t\t\t\t\treplaceState: true\n\t\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<p\n\t\t\t\t\t\t\t\t\tclass=\"{activeTeamId === teamId\n\t\t\t\t\t\t\t\t\t\t? 'active font-extrabold'\n\t\t\t\t\t\t\t\t\t\t: ''} col-span-2 text-left\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t{#if activeTeamId === teamId}\n\t\t\t\t\t\t\t\t\t<div class=\"col-start-3 justify-self-end\">\n\t\t\t\t\t\t\t\t\t\t<PlanModal {teamId} />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t{/if}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t{/each}\n\t\t\t\t{/if}\n\t\t\t\t<li>\n\t\t\t\t\t<NewTeamModal />\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</ul>\n\t</div>\n</div>\n",
      "sha": "066749c118167be17c2a4ab304962fabbf0a66f4"
    }
  ]
])

const inputs = [
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 75,
      "endLine": 75
    },
    "classes": "text-2xl font-bold",
    "newCss": "color: #ffffff; paddingTop: 10px; fontWeight: lighter; paddingBottom: 10px; backgroundColor: #ff0000; paddingLeft: 10px"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 86,
      "endLine": 86
    },
    "classes": "w-64 min-h-full bg-base-100 space-y-2 p-2",
    "newCss": "backgroundColor: #2bff00"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/ProjectsView.svelte",
      "startLine": 60,
      "endLine": 60
    },
    "classes": "text-sm font-semibold truncate",
    "newCss": "fontWeight: lighter"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 67,
      "endLine": 67
    },
    "classes": "bg-black drawer-content px-4 py-6 overflow-auto h-screen",
    "newCss": "backgroundColor: #000000"
  }
]

const outputs = [
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/ProjectsView.svelte",
      "startLine": 60,
      "endLine": 60
    },
    "classes": "text-sm font-light truncate",
    "newCss": "fontWeight: lighter"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 86,
      "endLine": 86
    },
    "classes": "w-64 min-h-full bg-green-500 space-y-2 p-2",
    "newCss": "backgroundColor: #2bff00"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 67,
      "endLine": 67
    },
    "classes": "bg-black drawer-content px-4 py-6 overflow-auto h-screen",
    "newCss": "backgroundColor: #000000"
  },
  {
    "pathInfo": {
      "path": "dashboard/src/routes/dashboard/+page.svelte",
      "startLine": 75,
      "endLine": 75
    },
    "classes": "text-2xl font-extrabold pt-10 pb-10 bg-red-500 text-white pl-10",
    "newCss": "fontWeight: lighter; paddingTop: 10px; paddingBottom: 10px; backgroundColor: #ff0000; color: #ffffff; paddingLeft: 10px"
  }
]