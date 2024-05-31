<script lang="ts">
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import Pin from '$lib/assets/welcome-pin.gif';
	import Edit from '$lib/assets/welcome-edit.png';
	import { ExternalLink, Calendar, EnvelopeOpen, DrawingPin, Pencil2, Link1 } from 'svelte-radix';
	import type { Team, Payment, User } from '$shared/models';
</script>

<div class="flex" style="background-image: url({BackgroundImage});">
	<div>
		<div>Add attribute here</div>
		<div class="old">Update this class to new</div>
		<div>Add style here</div>
		<div style="color: blue;">Update this style</div>
		<h1 class="123">Both</h1>
	</div>
</div>
