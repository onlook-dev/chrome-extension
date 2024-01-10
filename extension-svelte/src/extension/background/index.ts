import { toggleVisbugStream } from '$lib/onlook/messaging'
import { toggleIn } from '$lib/visbug/visbug'

// When triggered, open tab or use existin project tab and toggle visbug in

const setListeners = () => {
	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnAvtiveTab()
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
