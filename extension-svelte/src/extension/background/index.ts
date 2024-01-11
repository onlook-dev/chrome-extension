import { DASHBOARD_AUTH_ROUTE, DASHBOARD_URL } from '../../lib/utils/constants'
import { authRequestStream, toggleVisbugStream } from '$lib/utils/messaging'
import { toggleIn } from '$lib/visbug/visbug'
import { authUserBucket } from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'

// When triggered, open tab or use existin project tab and toggle visbug in

const setListeners = () => {
	subscribeToFirebaseAuthChanges()

	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnActiveTab()
	})

	authRequestStream.subscribe(() => {
		const authUrl = `${DASHBOARD_URL}/${DASHBOARD_AUTH_ROUTE}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	authUserBucket.valueStream.subscribe(({ authUser }) => {
		if (authUser) {
			signInUser(authUser)
		}
	})
}

function toggleVisbugOnActiveTab() {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		toggleIn({ id: tabs[0].id })
	})
}

try {
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
