import { DASHBOARD_AUTH_ROUTE, DASHBOARD_URL } from '../../lib/utils/constants'
import { authRequestStream, toggleVisbugStream } from '$lib/utils/messaging'
import { toggleIn } from '$lib/visbug/visbug'
import { userBucket } from '$lib/utils/localstorage'
import { signInUser } from '$lib/firebase/auth'

// When triggered, open tab or use existin project tab and toggle visbug in

const setListeners = () => {
	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnAvtiveTab()
	})

	authRequestStream.subscribe(() => {
		const authUrl = `${DASHBOARD_URL}/${DASHBOARD_AUTH_ROUTE}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	userBucket.valueStream.subscribe(({ user, authUser }) => {
		// If user state exists, use it instead

		if (authUser) {
			signInUser(authUser)
		}
	})
}

function toggleVisbugOnAvtiveTab() {
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
