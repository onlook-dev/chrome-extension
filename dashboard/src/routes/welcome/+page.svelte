<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center; width: 100%; height: 100%"
>
	<div class="flex flex-col w-2/3 items-center" style="gap: 24px;">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pix</h1>
		<div class="flex flex-row w-full" style="height: fit-content; gap: 10px;">
			<div class="w-1/2 h-1/2 rounded-none px-4" style="padding: 10px; background-color: #000000; height: fit-content;">
				<div class="text-light">
					<h1 class="" style="color: #ffffff;">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-12 bg-stone-100" style="margin-bottom: 20px; height: 68px;"></div>
				</div>
				<div class="flex flex-col">
					<p style="color: #ffffff;">Hello</p>
					<p style="color: #ffffff;">World</p>
				</div>
			</div>
			<div class="w-1/2 h-1/2 rounded-none px-4" style="padding: 10px; height: fit-content; background-color: #000000;"></div>
				<div class="text-light">
					<h1 class="" style="color: #ffffff;">Onlook</h1>
					<h2 class="text-tertiary">Where Creativity meets Code</h2>
				</div>
				<div class="space-y-4">
					<div class="w-full h-12 bg-stone-100" style="height: 68px; margin-bottom: 20px;"></div>
				</div>
				<div class="flex flex-col">
					<p style="color: #ffffff;">Hello</p>
					<p style="color: #ffffff;">World</p>
				</div>
			</div>
		</div>

		<div class="w-full h-1/2 rounded-none px-4" style="padding: 20px; height: fit-content; background-color: #000000;">
			<div class="text-light">
				<h1 class="text-2xl" style="color: #ffffff;">Onlook</h1>
				<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
			</div>
			<div class="space-y-4">
				<div class="w-full h-12 bg-stone-100" style="margin-bottom: 20px; height: 88px; margin-top: 20px;"></div>
			</div>
			<div>
				<p class="text-sm font-light">
					<span class="text-tertiary">By clicking on Sign-In, you agree to Onlookâs</span>
					<!-- TODO: Add terms of service -->
					<a href={DashboardRoutes.PRIVACY} target="_blank" style="color: #ffffff;">Terms of Service </a>
					<span class="text-tertiary">and</span>
					<a href={DashboardRoutes.PRIVACY} target="_blank" style="color: #ffffff;">Privacy Policy</a>.
				</p>
			</div>
		</div>
	</div>
</div>
