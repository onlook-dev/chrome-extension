<script lang="ts">
	import type { Project } from '$shared/models/project'
	import { projectsMapBucket, popupStateBucket, teamsMapBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import { deleteProjectFromFirebase } from '$lib/storage/project'
	import { postTeamToFirebase } from '$lib/storage/team'

	export let project: Project
	const deleteModalId = 'delete-project-modal'

	function deleteProject() {
		// TODO: Check user permission in team first
		popupStateBucket
			.get()
			.then(({ activeTeamId }) => {
				teamsMapBucket.get().then(map => {
					const teamMap = new Map(Object.entries(map))
					const team = teamMap.get(activeTeamId)

					// Remove project from team
					team.projectIds = team.projectIds.filter((id: string) => id !== project.id)

					// Save to Firebase
					team && postTeamToFirebase(team)
					deleteProjectFromFirebase(project.id)

					// Save locally
					projectsMapBucket.remove(project?.id ?? '')
					teamsMapBucket.set({ [activeTeamId]: team })
				})
			})
			.finally(() => {
				popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
			})
	}
</script>

<div class="p-4 space-y-2">
	<div class="flex flex-col space-y-4">
		<div class="space-y-2">
			<span class="label-text">Name</span>
			<input
				value={project?.name}
				type="text"
				placeholder="My project"
				class="input input-bordered w-full"
				disabled
			/>
		</div>

		<div class="space-y-2">
			<span class="label-text">URL</span>
			<input
				value={project?.hostUrl}
				type="url"
				placeholder="https://onlook.dev"
				class="input input-bordered w-full"
				disabled
			/>
		</div>
		<div class="divider">Danger zone</div>
		<button
			on:click={() => {
				// @ts-ignore - showModal() does not exist on HTMLElement
				document.getElementById(deleteModalId)?.showModal()
			}}
			class="btn btn-outline btn-error"
		>
			Delete project
		</button>
		<dialog id={deleteModalId} class="modal">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Delete project?</h3>
				<p class="py-4">Deleted projects can NOT be restored. Continue?</p>
				<div class="modal-action">
					<form method="dialog space-x-2">
						<button class="btn btn-ghost">Cancel</button>
						<button class="btn btn-error" on:click={deleteProject}>Delete</button>
					</form>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</div>
</div>
