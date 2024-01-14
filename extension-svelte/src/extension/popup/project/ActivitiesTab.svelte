<script lang="ts">
	import { onMount } from 'svelte'

	import type { Activity } from '$models/activity'
	import type { Project } from '$models/project'
	import { EventMetadataType, type EventMetadata } from '$models/eventData'

	export let project: Project

	onMount(async () => {
		project.activities = [
			{
				id: '1',
				userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
				selector: 'body >',
				projectId: project.id,
				eventData: [
					{
						key: 'click',
						value: 'click',
						type: EventMetadataType.SOURCE_MAP_ID
					} as EventMetadata
				],
				visible: true,
				creationTime: new Date(),
				styleChanges: [{ key: 'color', newVal: 'red', oldVal: 'blue' }]
			} as Activity
		]
	})
</script>

Acitivites length: {project.activities.length}
