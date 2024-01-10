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

try {
	document.addEventListener('DOMContentLoaded', render)
} catch (error) {
	console.error(error)
}
