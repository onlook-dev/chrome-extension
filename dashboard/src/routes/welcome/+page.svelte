<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 w-full h-full"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<div class="flex flex-col w-2/3 items-center gap-6" style="height: 80%; width: 50%">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pixels</h1>
		<div class="flex flex-row w-full gap-2.5 bg-transparent p-0 h-auto" style="gap: 20px; width: 100%; flex-direction: row; height: 100%; justify-content: center;">
			<div class="w-1/2 h-full bg-black rounded-none px-4 border p-5" style="width: 100%; padding: 30px; height: 100%;">
				<div class="text-light">
					<h1 class="text-tertiary">Step 1</h1>
					<h2 class="text-tertiary text-white">Pin Onlook in your browser</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-tertiary mt-5 mb-5" style="background-color: #363636; width: 100%;"></div>
				</div>
				<div class="flex flex-col text-white" style="gap: 10px;">
					<p class="text-gray-400 text-sm">Click extensions in the upper right corner</p>
					<p class="text-gray-400 text-sm">Pin Onlook</p>
				</div>
			</div>

			<div class="w-1/2 rounded-none px-4 bg-black h-full p-5 border" style="width: 100%; padding: 30px; height: 100%;">
				<div class="text-white">
					<h1 class="text-tertiary">Step 2</h1>
					<h2 class="text-tertiary text-white">Start editing any page</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-tertiary mt-5 mb-5" style="width: 100%; background-color: #363636;"></div>
				</div>
				<div class="flex flex-col text-white" style="gap: 10px;">
					<p class="text-gray-400 text-sm">Go to any page you want to edit</p>
					<p class=" text-sm text-tertiary">Click the extension and start editing</p>
				</div>
			</div>
		</div>

		<div class="flex flex-row w-full h-[fit-content] rounded-none px-4 bg-black p-5 border" style="gap: 40px;">
			<div class="w-full h-[150px] bg-tertiary my-5 mt-5" style="background-color: #363636; width: 40%;"></div>
			<div class="text-white flex flex-col" style="padding: 20px; align-items: flex-start; flex-direction: column; gap: 10px; justify-content: flex-start; margin: 0px;">
				<p class="text-white">See Onlook in action</p>
				<p class="text-sm text-tertiary">
					Watch us walk through a Demo project and make a pull request in less than 1 minute
				</p>
				<a class="text-sm text-red-600" href="https://onlook.dev" target="_blank">Read our guide to getting started</a>
				<a class="text-sm text-red-600" href="https://onlook.dev" target="_blank"
					>Set up Onlook in your own Github Repo</a
				>
			</div>
		</div>
	</div>

	<div class="flex flex-row text-primary" style="margin-top: 40px; gap: 40px;">
		<div class="flex flex-col" style="gap: 0px;">
			<div style="color: #ff0000; font-size: 14px;">Still need help?</div>
			<div style="color: #ff0000; font-size: 14px;">Let's get you set up</div>
		</div>

		<div class="w-10 bg-red-900" style="display: flex; font-size: 14px; opacity: 1; flex-direction: row; align-items: center; width: fit-content; padding: 5px; color: #ff0000; background-color: #570000;"><div>Chat with a founder</div></div>
		<div class="w-10 bg-red-900" style="color: #ff0000; background-color: #570000; display: flex; width: fit-content; padding: 5px; font-size: 14px; opacity: 1; flex-direction: row; align-items: center"><div>Send us an email</div></div>
	</div>
</div>
