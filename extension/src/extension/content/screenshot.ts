import type { Activity } from '$shared/models/activity'
import { DATA_ONLOOK_ID, DATA_ONLOOK_IGNORE, ONLOOK_TOOLBAR } from '$shared/constants'
import * as htmlToImage from 'html-to-image';

export class ScreenshotService {
	pageScreenshot: string | undefined
	isProcessing: boolean = false;
	pixelRatio = 1;

	async takeActivityScreenshot(activity: Activity, canvas: HTMLCanvasElement, before: boolean) {
		// Get element
		const element = document.querySelector(activity.selector) as HTMLElement
		if (!element) return

		// Crop the page by the element
		const croppedImageUri = await this.cropPageByElement(element, canvas)

		// Set before image or after image
		if (before) {
			activity.beforeImage = croppedImageUri
		} else {
			activity.previewImage = croppedImageUri
		}
	}

	private getVisibleRect(el: HTMLElement, padding: number = 0): DOMRect {
		const bounds = el.getBoundingClientRect();
		let rect = {
			x: bounds.left + scrollX,
			y: bounds.top + window.scrollY,
			width: bounds.width,
			height: bounds.height
		};

		let visibleRect = DOMRect.fromRect(rect);

		// Adjust for padding
		visibleRect.x = Math.max(0, visibleRect.x - padding);
		visibleRect.y = Math.max(0, visibleRect.y - padding);
		visibleRect.width += padding * 2;
		visibleRect.height += padding * 2;

		// Ensure the rectangle does not exceed the viewport boundaries
		if (visibleRect.x + visibleRect.width > document.body.scrollWidth) {
			visibleRect.width = document.body.scrollWidth - visibleRect.x;
		}
		if (visibleRect.y + visibleRect.height > document.documentElement.scrollHeight) {
			visibleRect.height = document.documentElement.scrollHeight - visibleRect.y;
		}

		// Adjust width and height if padding causes them to extend beyond viewport
		if (visibleRect.width + visibleRect.x > document.body.scrollWidth) {
			visibleRect.width = document.body.scrollWidth - visibleRect.x - padding;
		}
		if (visibleRect.height + visibleRect.y > document.documentElement.scrollHeight) {
			visibleRect.height = document.documentElement.scrollHeight - visibleRect.y - padding;
		}

		// Ensure width and height are not negative after adjusting for padding
		visibleRect.width = Math.max(0, visibleRect.width);
		visibleRect.height = Math.max(0, visibleRect.height);

		return visibleRect;
	}

	private cropPageByElement(element: HTMLElement, canvas: HTMLCanvasElement): Promise<string> {
		return new Promise((resolve, reject) => {
			// Get the bounding rectangle of the element
			let rect = this.getVisibleRect(element, 20);

			// Adjust for device pixel ratio. Use 1 default
			const dpr = this.pixelRatio;

			// Create a new canvas to perform the cropping
			const croppedCanvas = document.createElement('canvas');
			const ctx = croppedCanvas.getContext('2d');
			if (!ctx) {
				reject('Could not get 2d context from canvas');
				return;
			}

			// Set dimensions for the cropped canvas
			croppedCanvas.width = rect.width * dpr;
			croppedCanvas.height = rect.height * dpr;

			// Draw the cropped area on the new canvas
			ctx.drawImage(
				canvas,
				rect.left * dpr, 		// x position on the source canvas, adjusted for scale
				rect.top * dpr,  		// y position on the source canvas, adjusted for scale
				rect.width * dpr, 		// width of the source rectangle
				rect.height * dpr, 		// height of the source rectangle
				0,                   	// x position on the destination canvas
				0,                   	// y position on the destination canvas
				rect.width * dpr,    	// width on the destination canvas
				rect.height * dpr    	// height on the destination canvas
			);

			// Get the image URI
			const elementImageUri = croppedCanvas.toDataURL('image/png');
			resolve(elementImageUri);
		});
	}

	takePageScreenshot(): Promise<HTMLCanvasElement> {
		// Filter our onlook elements
		function filter(node: HTMLElement) {
			try {
				if (node.tagName.toUpperCase() === DATA_ONLOOK_ID.toUpperCase() || node.id === `#${DATA_ONLOOK_ID}` || node.hasAttribute(DATA_ONLOOK_IGNORE) || node.tagName.toUpperCase() === ONLOOK_TOOLBAR.toUpperCase()) {
					return false;
				}
				return true;
			} catch (e) {
				return true;
			}
		}

		// Take entire body screenshot as a canvas
		const canvas = htmlToImage.toCanvas(document.body, {
			height: document.body.scrollHeight,
			width: document.body.scrollWidth,
			canvasWidth: document.body.scrollWidth,
			canvasHeight: document.body.scrollHeight,
			filter,
			quality: 0,
			pixelRatio: this.pixelRatio,
		})
		return canvas;
	}
}
