<script lang="ts">
	import '../app.css';

	import { goto } from '$app/navigation';
	import { UserImpl } from '$lib/models/user';
	import { getUserFromFirebase } from '$lib/storage/user';
	import { AUTHENTICATED_WITH_CONSOLE, ROUTE_DASHBOARD, ROUTE_SIGNIN } from '$lib/utils/constants';
	import { authUserStore, userStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import { subscribeToFirebaseAuthChanges } from '$lib/firebase/auth';
	import { setupFirebase } from '$lib/firebase/firebase';

	onMount(() => {
		setupFirebase();
		subscribeToFirebaseAuthChanges();
		// Subscribe to authUserStore changes to resolve db user
		authUserStore.subscribe((authUser) => {
			if (authUser) {
				// Get db user if none exists
				if (!$userStore) {
					getUserFromFirebase(authUser.uid).then((user) => {
						if (!user) {
							// If user doesn't exist, create new user
							user = new UserImpl({
								id: authUser.uid,
								name: authUser.displayName ?? authUser.providerData[0].displayName ?? '',
								email: authUser.email ?? '',
								profileImage: authUser.photoURL ?? '',
								projectIds: [],
								projectPreviews: [],
								sharedProjectPreviews: [],
								version: 0
							});
						}
						userStore.set(user);
					});
				}

				// Send message for extension authentication
				window.postMessage(
					{
						type: AUTHENTICATED_WITH_CONSOLE,
						user: JSON.stringify(authUser.toJSON())
					},
					window.location.origin
				);
				goto(ROUTE_DASHBOARD);
			} else {
				goto(ROUTE_SIGNIN);
			}
		});
	});
</script>

<slot />
