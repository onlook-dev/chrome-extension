<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 w-full h-full"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<div class="flex flex-col w-2/3 items-center gap-6">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pix</h1>
		<div class="flex flex-row w-full gap-2.5 h-auto bg-black p-2.5 h-auto" style="padding: 0px; gap: 10px; background-color: transparent;">
			<div class="w-1/2 h-1/2 rounded-none px-4" style="height: 100%; background-color: #000000;">
				<div class="text-light">
					<h1 class="text-white">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[68px] bg-stone-100 mb-5"></div>
				</div>
				<div class="flex flex-col text-white">
					<p class="text-white">Hello</p>
					<p>World</p>
				</div>
			</div>

			<div class="w-1/2 rounded-none px-4 bg-black h-auto p-2" style="height: 100%; background-color: #000000;">
				<div class="text-white">
					<h1 class="">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-[68px] bg-stone-100 mb-5"></div>
				</div>
				<div class="flex flex-col text-white">
					<p class="text-white">Hello</p>
					<p>World</p>
				</div>
			</div>
		</div>

		<div class="w-full h-[fit-content] rounded-none px-4 bg-black p-5">
			<div class="text-white">
				<h1 class="text-2xl">Onlook</h1>
				<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
			</div>
			<div class="space-y-4">
				<div class="w-full h-[88px] bg-stone-100 my-5"></div>
			</div>
			<div>
				<p class="text-sm font-light">
					<span class="text-tertiary">By clicking on Sign-In, you agree to Onlook's</span>
					<!-- TODO: Add terms of service -->
					<a href={DashboardRoutes.PRIVACY} target="_blank" style="color: #ffffff;">Terms of Service </a>
					<span class="text-tertiary">and</span>
					<a href={DashboardRoutes.PRIVACY} target="_blank" class="text-white">Privacy Policy</a>.
				</p>
			</div>
		</div>
	</div>
</div>
