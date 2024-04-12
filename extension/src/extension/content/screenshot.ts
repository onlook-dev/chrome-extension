import type { Activity } from '$shared/models/activity'
import { getProjectById, projectsMapBucket } from '$lib/utils/localstorage'
import { pageScreenshotResponseStream, sendPageScreenshotRequest } from '$lib/utils/messaging'
import { nanoid } from 'nanoid'

interface QueueItem {
	activity: Activity
	before: boolean
	refresh: boolean
}

export class ScreenshotService {
	screenshotQueue: QueueItem[] = []
	pageScreenshot: string | undefined
	isProcessing: boolean = false;

	async takeScreenshot(activity: Activity, before: boolean = false, refresh: boolean = false) {
		this.screenshotQueue.push({ activity, before, refresh });
		if (!this.isProcessing) {
			this.isProcessing = true;
			await this.processScreenshotQueue();
			this.isProcessing = false;
		}
	}

	private async processScreenshotQueue() {
		while (this.screenshotQueue.length > 0) {
			// Process item in queue 1 by 1
			await this.takeActivityScreenshot(this.screenshotQueue[0])
			// Remove the processed item from the queue
			this.screenshotQueue.shift()
		}
	}

	private async takeActivityScreenshot(queueItem: QueueItem) {
		const { activity, before, refresh } = queueItem
		// Get element
		const element = document.querySelector(activity.selector) as HTMLElement
		if (!element) return
		// Get screenshot
		const pageImageUri = await this.takePageScreenshot(refresh)
		const croppedImageUri = await this.cropPageByElement(element, pageImageUri)

		// Set before image or after image
		if (before) {
			console.log('Setting before image')
			activity.beforeImage = croppedImageUri
		} else {
			console.log('Setting preview image')
			activity.previewImage = croppedImageUri
		}

		// Update project
		const project = await getProjectById(activity.projectId)
		project.activities[activity.selector] = activity
		await projectsMapBucket.set({ [project.id]: project })
	}

	getVisibleRect(rect: Object, padding: number = 0): DOMRect {
		let visibleRect = DOMRect.fromRect(rect);

		// Adjust for padding
		visibleRect.x = Math.max(0, visibleRect.x - padding);
		visibleRect.y = Math.max(0, visibleRect.y - padding);
		visibleRect.width += padding * 2;
		visibleRect.height += padding * 2;

		// Ensure the rectangle does not exceed the viewport boundaries
		if (visibleRect.x + visibleRect.width > window.innerWidth) {
			visibleRect.width = window.innerWidth - visibleRect.x;
		}
		if (visibleRect.y + visibleRect.height > window.innerHeight) {
			visibleRect.height = window.innerHeight - visibleRect.y;
		}

		// Adjust width and height if padding causes them to extend beyond viewport
		if (visibleRect.width + visibleRect.x > window.innerWidth) {
			visibleRect.width = window.innerWidth - visibleRect.x - padding;
		}
		if (visibleRect.height + visibleRect.y > window.innerHeight) {
			visibleRect.height = window.innerHeight - visibleRect.y - padding;
		}

		// Ensure width and height are not negative after adjusting for padding
		visibleRect.width = Math.max(0, visibleRect.width);
		visibleRect.height = Math.max(0, visibleRect.height);

		return visibleRect;
	}

	private cropPageByElement(element: HTMLElement, pageImageUri: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let image = new Image();
			let dataURL = pageImageUri;
			// Get element bounding box
			const hoverInfo = element.getBoundingClientRect()

			image.onload = () => {
				let rect = { x: hoverInfo.left, y: hoverInfo.top, width: hoverInfo.width, height: hoverInfo.height };
				let visibleRect = this.getVisibleRect(rect, 20);
				let canvas: HTMLCanvasElement | undefined | null = document.createElement('canvas');
				let ctx: CanvasRenderingContext2D | undefined | null = canvas.getContext('2d');

				if (!ctx) return;
				const zoomLevel = window.devicePixelRatio;
				if (zoomLevel != 1.0) {
					visibleRect.x *= zoomLevel;
					visibleRect.y *= zoomLevel;
					visibleRect.width *= zoomLevel;
					visibleRect.height *= zoomLevel;
				}
				canvas.width = visibleRect.width;
				canvas.height = visibleRect.height;

				ctx.drawImage(image, visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height,
					0, 0, visibleRect.width, visibleRect.height);

				((croppedDataURL) => {
					canvas = null;
					ctx = null;
					resolve(croppedDataURL);
				})(canvas.toDataURL());
			};
			image.src = dataURL;
		});

	}

	private takePageScreenshot(refresh: boolean): Promise<string> {
		return new Promise((resolve, reject) => {
			// TODO: If hiding editor, should setTimeout 50ms to ensure editor is hidden
			let signature = nanoid()
			const subscription = pageScreenshotResponseStream.subscribe(([data]) => {
				if (data.signature !== signature) return;
				resolve(data.image);
				subscription.unsubscribe();
			});
			sendPageScreenshotRequest({ signature, refresh });
		});
	}
}
