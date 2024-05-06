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
			<div class="w-1/2 h-full bg-black rounded-none px-4">
			
				<div class="text-gray-600">Step 1</div>
					<h1 class="text-white">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#3b3b3b] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-gray-400 text-sm">Click extensions in the upper right corner</div>
					<p class="text-white">Hello</p>
					<p class="text-gray-400 text-sm">Pin Onlook</p>
				</div>
			</div>
<div class="p-5 border"></div>
			<div class="w-1/2 rounded-none px-4 bg-black h-full p-2">
				<div class="text-gray-600">Step 2</div>
					<h1 class="">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[150px] bg-[#3b3b3b] mt-5 mb-5"></div>
				</div>
				<div class="flex flex-col text-gray-400 text-sm">Go to any page you want to edit</div>
					<p class="text-white text-sm text-[#a3a3a3]">Hello Click the extension and start editing</p>
					<p>World</p>
				</div>
			</div>
		</div>
<div class="border">
		<div class="w-full h-[fit-content] rounded-none px-4 bg-black p-5">
			<div class="text-white text-xl">See Onlook in action</div>
				<h1 class="text-2xl text-[#a3a3a3]">Watch us walk through a Demo project and make a pull request in less than 1 minute</h1>
				<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
			</div>
			<div class="space-y-4 h-[150px] mt-5 bg-gray-800">
				<div class="w-full h-[88px] bg-stone-100 my-5"></div>
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
