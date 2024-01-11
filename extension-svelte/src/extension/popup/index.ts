import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { UserImpl } from '$lib/models/user'
import { userStore } from '$lib/popup/store'
import { userBucket } from '$lib/utils/localstorage'
import Popup from './Popup.svelte'
import '/src/app.css'

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/
let popupInstance: Popup | null = null

function render() {
	const target = document.getElementById('app')
	document.body.style.width = '400px'
	document.body.style.height = '350px'
	if (target) {
		popupInstance = new Popup({
			target,
			props: {}
		})
		return
	}
}

function setupListeners() {
	// Listen for auth changes
	subscribeToFirebaseAuthChanges()

	// Listen for user changes
	userBucket.valueStream.subscribe(({ user, authUser }) => {
		// If user state exists, use it instead
		if (user) {
			userStore.set(new UserImpl(user))
		}
		if (authUser) {
			signInUser(authUser)
		}
	})
}

try {
	setupListeners()
	document.addEventListener('DOMContentLoaded', render)
} catch (error) {
	console.error(error)
}
