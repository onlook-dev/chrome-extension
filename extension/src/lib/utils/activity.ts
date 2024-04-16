import type { Activity } from "$shared/models/activity"

// TODO: Use editor to apply event instead
export function revertActivityChanges(activity: Activity) {
	const element = document.querySelector(activity.selector) as any
	if (element) {
		Object.entries(activity.styleChanges ?? {}).forEach(([style, changeObject]) => {
			// Apply style to element
			element.style[style] = changeObject.oldVal
		})
		if (activity.textChanges) {
			element.innerText = activity.textChanges.text.oldVal
		}
		if (activity.attributeChanges) {
			element.className = activity.attributeChanges.full.oldVal
		}
	}
}

export function applyActivityChanges(activity: Activity): boolean {
	const element = document.querySelector(activity.selector) as any
	if (element) {
		Object.entries(activity.styleChanges ?? {}).forEach(([style, changeObject]) => {
			// Apply style change to element
			element.style[style] = changeObject.newVal
		})
		Object.entries(activity.textChanges ?? {}).forEach(([textChange, changeObject]) => {
			// Apply text change to element
			element.innerText = changeObject.newVal
		})
		Object.entries(activity.attributeChanges ?? {}).forEach(([attributeChange, changeObject]) => {
			// Apply attribute change to element
			if (attributeChange === 'full') {
				element.className = changeObject.newVal
			}
		})
		if (activity.path !== element.dataset.onlookId) {
			activity.path = element.dataset.onlookId
			return true
		}
	}
	return false
}
