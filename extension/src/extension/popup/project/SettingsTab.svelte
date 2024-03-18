<script lang="ts">
	import type { Project } from '$shared/models/project'
	import {
		projectsMapBucket,
		popupStateBucket,
		teamsMapBucket,
		getTeamById
	} from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import { FirebaseService } from '$lib/storage'
	import { FirestoreCollections } from '$shared/constants'

	export let project: Project
	const modalId = 'delete-project-modal'
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS)

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.showModal()
			modal.addEventListener(
				'click',
				event => {
					if (event.target === modal) {
						closeModal()
					}
				},
				{ once: true }
			)
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.close()
		}
	}

	function deleteProject() {
		projectService
			.delete(project.id)
			.then(() => {
				popupStateBucket.get().then(({ activeTeamId }) => {
					// Remove project from team locally
					getTeamById(activeTeamId).then(team => {
						// Remove project from team
						team.projectIds = team.projectIds.filter((id: string) => id !== project.id)

						// Save locally
						projectsMapBucket.remove(project?.id ?? '')
						teamsMapBucket.set({ [activeTeamId]: team })
					})
				})
			})
			.finally(() => {
				popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD, activeProjectId: '' })
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
				on:input={e => {
					project.name = e.currentTarget.value
				}}
				on:blur={e => {
					projectsMapBucket.set({ [project.id]: project })
					projectService.post(project)
				}}
			/>
		</div>

		<div class="space-y-2">
			<span class="label-text">URL</span>
			<input
				value={project?.hostUrl}
				type="url"
				placeholder="https://onlook.dev"
				class="input input-bordered w-full"
				on:input={e => {
					project.hostUrl = e.currentTarget.value
				}}
				on:blur={e => {
					projectsMapBucket.set({ [project.id]: project })
					projectService.post(project)
				}}
			/>
		</div>

		<div class="divider">Danger zone</div>
		<button on:click={showModal} class="btn btn-outline btn-error"> Delete project </button>
		<dialog id={modalId} class="modal">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Delete project?</h3>
				<p class="py-4">Deleted projects can NOT be restored. Continue?</p>
				<div class="modal-action space-x-2">
					<button class="btn" on:click={closeModal}>Cancel</button>
					<button class="btn btn-error" on:click={deleteProject}>Delete</button>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</div>
</div>
