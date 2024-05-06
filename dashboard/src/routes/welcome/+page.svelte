<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 w-full h-full"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<div class="flex flex-col w-2/3 items-center gap-6">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pixels</h1>
		<div class="flex flex-row w-full gap-2.5 h-auto bg-transparent p-0 h-auto">
			<div class="w-1/2 h-full bg-black rounded-none px-4 border p-5">
				<div class="text-light">
					<h1 class="text-[#949494]">Step 1</h1>
					<h2 class="text-tertiary text-white">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#3b3b3b] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-white">
					<p class="text-gray-400 text-sm">Click extensions in the upper right corner</p>
					<p class="text-gray-400 text-sm">Pin Onlook</p>
				</div>
			</div>

			<div class="w-1/2 rounded-none px-4 bg-black h-full p-5 border">
				<div class="text-white">
					<h1 class="text-[#949494]">Step 2</h1>
					<h2 class="text-tertiary text-white">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#3b3b3b] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-white">
					<p class="text-gray-400 text-sm">Go to any page you want to edit</p>
					<p class="text-white text-sm text-[#a3a3a3]">Click the extension and start editing</p>
				</div>
			</div>
		</div>

		<div class="w-full h-[fit-content] rounded-none px-4 bg-black p-5 border">
			<div class="text-white">
				<h1 class="text-xl text-white">See Onlook in action</h1>
				<h2 class="text-xl text-tertiary text-[#a3a3a3]">Watch us walk through a Demo project and make a pull request in less than 1 minute</h2>
			</div>
			<div class="space-y-4">
				<div class="w-full h-[150px] bg-[#3b3b3b] my-5 mt-5"></div>
			</div>
			<div>
				<p class="text-sm font-light">
					<span class="text-tertiary">By clicking on Sign-In, you agree to Onlook's</span>
					<!-- TODO: Add terms of service -->
					<a href={DashboardRoutes.PRIVACY} target="_blank" class="text-white">Terms of Service </a>
					<span class="text-tertiary">and</span>
					<a href={DashboardRoutes.PRIVACY} target="_blank" class="text-white">Privacy Policy</a>.
				</p>
			</div>
		</div>
	</div>
</div>
