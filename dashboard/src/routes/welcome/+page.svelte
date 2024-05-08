<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 w-full h-full bg-cover bg-center"
	style="background-image: url({BackgroundImage});"
>
	<div class="flex flex-col w-1/2 items-center gap-6 h-[80%]">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pixels</h1>
		<div class="flex flex-row w-full justify-center h-screen gap-5 bg-transparent p-0">
			<div class="w-full h-full bg-black rounded-none px-7 border">
				<div class="text-light">
					<h1 class="text-tertiary">Step 1</h1>
					<h2 class="text-tertiary text-white">Pin Onlook in your browser</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#363636] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-white gap-2">
					<p class="text-gray-400 text-sm">Click extensions in the upper right corner</p>
					<p class="text-gray-400 text-sm">Pin Onlook</p>
				</div>
			</div>

			<div class="w-full rounded-none px-4 bg-black h-full p-5 border p-8">
				<div class="text-white">
					<h1 class="text-tertiary">Step 2</h1>
					<h2 class="text-tertiary text-white">Start editing any page</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#363636] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-white gap-2">
					<p class="text-gray-400 text-sm">Go to any page you want to edit</p>
					<p class=" text-sm text-tertiary">Click the extension and start editing</p>
				</div>
			</div>
		</div>

		<div class="flex flex-row w-full h-[fit-content] rounded-none px-4 bg-black p-5 border gap-[40px]">
			<div class="w-2/5 h-[150px] bg-[#363636] my-5"></div>
			<div class="text-white flex flex-col items-start justify-start m-0 p-5 gap-2">
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

	<div class="flex flex-row text-primary mt-10 gap-10">
		<div class="flex flex-col gap-0">
			<div class="text-[#ff0000] text-[14px]">Still need help?</div>
			<div class="text-[#ff0000] text-[14px]">Let's get you set up</div>
		</div>

		<div class="flex flex-row items-center bg-red-500 p-1 text-red-500 w-fit"><div>Chat with a founder</div></div>
		<div class="flex items-center justify-center bg-red-500 p-1 text-[14px] text-red-500 w-fit opacity-100"><div>Send us an email</div></div>
	</div>
</div>
