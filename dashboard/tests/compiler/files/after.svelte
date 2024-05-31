<script lang="ts">
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import Pin from '$lib/assets/welcome-pin.gif';
	import Edit from '$lib/assets/welcome-edit.png';
	import { ExternalLink, Calendar, EnvelopeOpen, DrawingPin, Pencil2, Link1 } from 'svelte-radix';
	import type { Team, Payment, User } from '$shared/models';
</script>

<div class="flex" style="background-image: url({BackgroundImage});">
	<div>
		<div class="new">Add attribute here</div>
		<div class="new">Update this class to new</div>
		<div style="color: red;">Add style here</div>
		<div style="color: red;">Update this style</div>
		<h1 style="color: red;" class="123">Both</h1>
	</div>
</div>
