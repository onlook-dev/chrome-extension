import type { Activity } from '$shared/models/activity'
import { getProjectById, projectsMapBucket } from '$lib/utils/localstorage'
import { isBase64ImageString } from '$shared/helpers'
import { pageScreenshotResponseStream, sendPageScreenshotRequest } from '$lib/utils/messaging'
import { nanoid } from 'nanoid'
export class ScreenshotService {
	activityScreenshotQueue: Activity[] = []
	pageScreenshot: string | undefined
	isProcessing: boolean = false;

	async takeScreenshot(activity: Activity) {
		this.activityScreenshotQueue.push(activity);
		console.log(this.activityScreenshotQueue.length)
		if (!this.isProcessing) {
			this.isProcessing = true;
			await this.processScreenshotQueue();
			this.isProcessing = false;
		}
	}

	private async processScreenshotQueue() {
		while (this.activityScreenshotQueue.length > 0) {
			console.log('before ', this.activityScreenshotQueue.length)
			// Process item in queue 1 by 1
			const activity = this.activityScreenshotQueue[0]
			await this.takeActivityScreenshot(activity)
			console.log('during', this.activityScreenshotQueue.length)
			// Remove the processed item from the queue
			this.activityScreenshotQueue.shift()
			console.log('after ', this.activityScreenshotQueue.length)
		}
	}

	private async takeActivityScreenshot(activity: Activity) {
		// Get element
		const element = document.querySelector(activity.selector) as HTMLElement
		if (!element) return
		console.log('takeActivityScreenshot')
		// Get screenshot
		const pageImageUri = await this.takePageScreenshot()
		console.log('takePageScreenshot')
		const croppedImageUri = await this.cropPageByElement(element, pageImageUri)
		activity.previewImage = croppedImageUri

		console.log('activity.previewImage',)
		// Update project
		const project = await getProjectById(activity.projectId)
		project.activities[activity.selector] = activity
		await projectsMapBucket.set({ [project.id]: project })
		console.log('process')
	}


	getVisibleRect(rect: Object): DOMRect {
		let visibleRect = DOMRect.fromRect(rect);

		if (visibleRect.x < 0) {
			visibleRect.width += visibleRect.x;
			visibleRect.x = 0;
		}
		if (visibleRect.y < 0) {
			visibleRect.height += visibleRect.y;
			visibleRect.y = 0;
		}
		if (visibleRect.x + visibleRect.width > window.innerWidth) {
			visibleRect.width = window.innerWidth - visibleRect.x;
		}
		if (visibleRect.y + visibleRect.height > window.innerHeight) {
			visibleRect.height = window.innerHeight - visibleRect.y;
		}
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
				let visibleRect = this.getVisibleRect(rect); //getVisibleRect(hoverInfo.clientRect);
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

	private takePageScreenshot(): Promise<string> {
		return new Promise((resolve, reject) => {
			let signature = nanoid()
			const subscription = pageScreenshotResponseStream.subscribe(([data]) => {
				if (data.signature !== signature) return;
				resolve(data.image);
				subscription.unsubscribe();
			});
			sendPageScreenshotRequest(signature);
		});
	}
}
