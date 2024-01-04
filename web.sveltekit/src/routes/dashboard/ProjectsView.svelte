<script>
	import { goto } from '$app/navigation';
	import { ROUTE_PROJECTS } from '$lib/utils/constants';

	let projects = [
		// Example project items
		{
			id: 1,
			name: 'DaisyUI Project',
			previewImage: 'https://picsum.photos/200',
			url: 'https://daisyui.com',
			author: {
				id: 1,
				name: 'John Doe',
				avatar: 'https://picsum.photos/200'
			},
			lastEdited: '2021-08-01T00:00:00.000Z'
		},
		{
			id: 1,
			name: 'DaisyUI Project',
			previewImage: 'https://picsum.photos/200',
			url: 'https://daisyui.com',
			author: {
				id: 1,
				name: 'John Doe',
				avatar: 'https://picsum.photos/200'
			},
			lastEdited: '2021-08-01T00:00:00.000Z'
		},
		{
			id: 1,
			name: 'DaisyUI Project',
			previewImage: 'https://picsum.photos/200',
			url: 'https://daisyui.com',
			author: {
				id: 1,
				name: 'John Doe',
				avatar: 'https://picsum.photos/200'
			},
			lastEdited: '2021-08-01T00:00:00.000Z'
		}
	];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
	{#each projects as project}
		<a
			on:click={() => goto(`${ROUTE_PROJECTS}/${project.id}`)}
			class="rounded space-y-4 p-4 hover:shadow block"
		>
			<figure class="">
				<img src={project.previewImage} alt={project.name} class="aspect-video rounded w-full" />
			</figure>
			<div class="flex items-center space-x-2">
				<div class="avatar">
					<div class="w-6 mask mask-circle">
						<img src={project.author.avatar} alt="Avatar of {project.author.name}" />
					</div>
				</div>
				<div>
					<p class="text-sm font-semibold">{project.name}</p>
					<p class="text-xs opacity-70">{project.url}</p>
				</div>
			</div>
		</a>
	{/each}
</div>
