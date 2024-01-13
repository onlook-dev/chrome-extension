<script lang="ts">
	import type { Project } from '$models/project'
	import type { Activities } from '$models/activities'

	import { projectsMapBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'

	export let project: Project

	project.changeSets = [{} as Activities]
</script>

Comments length: {project.comments.length}
