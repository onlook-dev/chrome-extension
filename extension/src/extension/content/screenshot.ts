import type { Activity } from '$shared/models/activity'
import { DATA_ONLOOK_ID, DATA_ONLOOK_IGNORE, ONLOOK_TOOLBAR } from '$shared/constants'
import * as htmlToImage from 'html-to-image';
import { consoleLogImage } from '$lib/utils/helpers';

export class ScreenshotService {
	pageScreenshot: string | undefined
	isProcessing: boolean = false;

	async takeActivityScreenshot(activity: Activity, canvas: HTMLCanvasElement, before: boolean) {
		// Get element
		const element = document.querySelector(activity.selector) as HTMLElement
		if (!element) return

		const croppedImageUri = await this.cropPageByElement(element, canvas)

		// Set before image or after image
		if (before) {
			activity.beforeImage = croppedImageUri
		} else {
			activity.previewImage = croppedImageUri
		}

		consoleLogImage(croppedImageUri);
	}

	private cropPageByElement(element: HTMLElement, canvas: HTMLCanvasElement): Promise<string> {
		return new Promise((resolve, reject) => {
			// Get the bounding rectangle of the element
			const rect = element.getBoundingClientRect();

			// Adjust for scroll position
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;

			// Adjust for device pixel ratio
			const dpr = window.devicePixelRatio || 1;

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
				(rect.left + scrollX) * dpr, // x position on the source canvas, adjusted for scroll and scale
				(rect.top + scrollY) * dpr,  // y position on the source canvas, adjusted for scroll and scale
				rect.width * dpr, // width of the source rectangle
				rect.height * dpr, // height of the source rectangle
				0,                   // x position on the destination canvas
				0,                   // y position on the destination canvas
				rect.width * dpr,    // width on the destination canvas
				rect.height * dpr    // height on the destination canvas
			);

			// Get the image URI
			const elementImageUri = croppedCanvas.toDataURL('image/png');
			resolve(elementImageUri);
		});
	}

	takePageScreenshot(refresh: boolean): Promise<HTMLCanvasElement> {
		function filter(node: HTMLElement) {
			try {
				if (node.tagName.toUpperCase() === DATA_ONLOOK_ID.toUpperCase() || node.id === `#${DATA_ONLOOK_ID}` || node.hasAttribute(DATA_ONLOOK_IGNORE)) {
					return false;
				}
				return true;
			} catch (e) {
				return true;
			}
		}

		const canvas = htmlToImage.toCanvas(document.body, {
			height: document.body.scrollHeight,
			width: document.body.scrollWidth,
			filter,
			quality: 0,
		})
		return canvas;
	}
}
