<script lang="ts">
	import type { Project } from '$models/project'
	import { projectsMapBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'

	export let project: Project
</script>

Changeset length: {project.changeSets.length}
