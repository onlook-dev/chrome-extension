<script>
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import Pin from '$lib/assets/welcome-pin.gif';
	import { ExternalLink, Calendar, EnvelopeOpen, DrawingPin, Pencil2, Link1 } from 'svelte-radix';
</script>

<div
	class="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-center"
	style="background-image: url({BackgroundImage});"
>
	<div class="flex flex-col w-1/2 items-center gap-6 min-w-[800px]">
		<h1 class="text-2xl text-white text-start w-full">Let's push some pixels</h1>
		<div class="flex flex-row w-full justify-center h-full gap-5 bg-transparent p-0">
			<div class="w-full h-full bg-black rounded-none p-6 border">
				<div class="text-light">
					<h1 class="text-tertiary">Step 1</h1>
					<h2 class="text-tertiary text-white">Pin Onlook in your browser</h2>
				</div>
				<img class="object-cover w-full bg-[#363636] my-4" src={Pin} alt="Pin extension tip" />
				<div class="flex flex-col text-white gap-2">
					<p class="text-gray-400 text-sm flex flex-row items-center">
						<svg
							class="mr-2"
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.52143 4.43196e-07C7.52786 0.0750004 6.72 0.843751 6.59 1.81875V1.875H4.11071C3.76595 1.90998 3.44648 2.07344 3.21468 2.33347C2.98288 2.5935 2.85541 2.93142 2.85714 3.28125V5.40938H2.80143C2.30176 5.47955 1.84412 5.72988 1.513 6.11415C1.18189 6.49842 0.999674 6.99067 1 7.5V7.65C1.07429 8.64375 1.83571 9.45937 2.80143 9.59062H2.85714V11.8594C2.89179 12.2075 3.0537 12.53 3.31125 12.764C3.5688 12.9981 3.9035 13.1268 4.25 13.125H6.12571V13.1812C6.19522 13.6857 6.44317 14.1478 6.82378 14.4821C7.20439 14.8164 7.69195 15.0003 8.19643 15H8.345C8.8235 14.9657 9.27574 14.7662 9.62576 14.435C9.97578 14.1038 10.2023 13.6611 10.2671 13.1812V13.125H12.6071C13.3779 13.125 14 12.4969 14 11.7188V8.67188H12.2636C11.9754 8.64382 11.7081 8.50808 11.514 8.29127C11.3198 8.07447 11.2129 7.79226 11.2143 7.5V7.3875C11.27 6.79688 11.7714 6.32813 12.375 6.32813H14V3.15C13.9675 2.80023 13.8066 2.4754 13.5488 2.23944C13.291 2.00348 12.9551 1.87347 12.6071 1.875H10.7314V1.81875C10.6619 1.31428 10.414 0.852233 10.0334 0.517936C9.65275 0.18364 9.16519 -0.000329559 8.66071 4.43196e-07H8.52143ZM8.66071 0.9375C9.30143 0.9375 9.82143 1.4625 9.82143 2.10938V2.8125H12.6071L12.7 2.82188C12.8064 2.84379 12.9019 2.9027 12.9698 2.98835C13.0377 3.074 13.0736 3.18096 13.0714 3.29063V5.39063H12.375C11.2886 5.39063 10.3786 6.23438 10.295 7.33125L10.2857 7.48125C10.2857 8.60625 11.1214 9.51562 12.2079 9.6L12.3564 9.60938H13.0714V11.7188C13.0714 11.8431 13.0225 11.9623 12.9354 12.0502C12.8484 12.1381 12.7303 12.1875 12.6071 12.1875H9.35714V12.8906C9.35714 13.2014 9.23485 13.4995 9.01718 13.7193C8.7995 13.939 8.50427 14.0625 8.19643 14.0625C7.88859 14.0625 7.59336 13.939 7.37568 13.7193C7.158 13.4995 7.03571 13.2014 7.03571 12.8906V12.1875H4.25C4.12686 12.1875 4.00877 12.1381 3.9217 12.0502C3.83463 11.9623 3.78571 11.8431 3.78571 11.7188V8.67188H3.08929C2.78145 8.67188 2.48621 8.54841 2.26854 8.32864C2.05086 8.10887 1.92857 7.8108 1.92857 7.5C1.92857 7.1892 2.05086 6.89113 2.26854 6.67136C2.48621 6.45159 2.78145 6.32813 3.08929 6.32813H3.78571V3.28125C3.78571 3.02813 3.99929 2.8125 4.25 2.8125H7.5V2.10938C7.5 1.4625 8.02 0.9375 8.66071 0.9375Z"
								fill="white"
								style="fill:white;fill-opacity:1;"
							/>
						</svg>
						Click extensions in the upper right corner
					</p>
					<p class="text-gray-400 text-sm flex flex-row items-center">
						<DrawingPin class="text-primary w-4 h-4 mr-2" />Pin Onlook
					</p>
				</div>
			</div>

			<div class="w-full rounded-none bg-black h-full border p-6">
				<div class="text-white">
					<h1 class="text-tertiary">Step 2</h1>
					<h2 class="text-tertiary text-white">Start editing any page</h2>
				</div>
				<img class="object-cover w-full bg-[#363636] my-4" src={Pin} alt="Pin extension tip" />
				<div class="flex flex-col text-white gap-2">
					<p class="text-gray-400 text-sm flex flex-row items-center">
						<Link1 class="text-primary w-4 h-4 mr-2" /> Go to any page you want to edit
					</p>
					<p class="text-tertiary text-sm flex flex-row items-center">
						<Pencil2 class="text-primary w-4 h-4 mr-2" />Click the extension and start editing
					</p>
				</div>
			</div>
		</div>

		<div class="flex flex-row w-full h-[fit-content] rounded-none bg-black p-6 border gap-[40px]">
			<iframe
				class="w-3/5 h-[150px]"
				src="https://www.youtube.com/embed/pUzCOpIE1zQ?si=cnwzWINbIT88ZiAU"
				title="Onlook Demo Video"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<div class="text-white flex flex-col items-start m-0 p-5 gap-2">
				<p class="text-white">See Onlook in action</p>
				<p class="text-sm text-tertiary">
					Watch us walk through a Demo project and make a pull request in less than 1 minute
				</p>
				<a
					class="text-sm text-red-600 hover:underline flex flex-row items-center"
					href="https://onlook.dev/blog/create-your-first-pull-request"
					target="_blank">Read our guide to getting started <ExternalLink class="w-4 h-4 ml-2" /></a
				>
				<a
					class="text-sm text-red-600 hover:underline flex flex-row items-center"
					href="https://onlook.dev/blog/installing-onlook"
					target="_blank"
					>Set up Onlook in your own Github Repo <ExternalLink class="w-4 h-4 ml-2" />
				</a>
			</div>
		</div>
	</div>

	<div class="flex flex-row text-primary mt-6 gap-6">
		<div class="flex flex-col gap-0">
			<div class="text-[#ff0000] text-[14px]">Still need help?</div>
			<div class="text-[#ff0000] text-[14px]">Let's get you set up</div>
		</div>

		<a
			class="flex flex-row items-center rounded-xs bg-red-500/20 py-2 px-3 text-red-500 w-fit hover:bg-red-500/30"
			href="https://calendar.app.google/hjCAg7HpczY39Zd4A"
			target="_blank"
		>
			<Calendar class="w-4 h-4 mr-2" />
			<div class="text-sm">Chat with a founder</div>
		</a>
		<a
			class="flex items-center justify-center rounded-xs bg-red-500/20 py-2 px-3 text-[14px] text-red-500 w-fit hover:bg-red-500/30"
			href="mailto:founders@onlook.dev"
			target="_blank"
		>
			<EnvelopeOpen class="w-4 h-4 mr-2" />
			<div class="text-sm">Send us an email</div>
		</a>
	</div>
</div>
