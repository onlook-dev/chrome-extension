import { initializeMixpanel } from "$lib/mixpanel";
import { BackgroundEventHandlers } from "./events";
import "/lib/single-file-background.js";

try {
	const handler = new BackgroundEventHandlers()
	handler.listen()
	initializeMixpanel()

	// Keep service worker alive
	const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
	chrome.runtime.onStartup.addListener(keepAlive);
	keepAlive();
} catch (error) {
	console.error(error)
}

