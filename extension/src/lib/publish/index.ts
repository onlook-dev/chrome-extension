import { hideEditor, showEditor } from "$lib/editor/helpers";
import { applyActivityChanges, revertActivityChanges } from "$lib/utils/activity";
import { baseUrl } from "$lib/utils/env";
import { sendOpenUrlRequest, sendSaveProject } from "$lib/utils/messaging";
import { DashboardRoutes } from "$shared/constants";
import type { Project } from "$shared/models/project";
import type { ScreenshotService } from "$extension/content/screenshot";

export class PublishProjectService {
    constructor(private project: Project, private screenshotService: ScreenshotService) { }

    public async publish() {
        await this.takeActivityScreenshots();
        await sendSaveProject(this.project);
        sendOpenUrlRequest(`${baseUrl}${DashboardRoutes.PROJECTS}/${this.project.id}`)
    }

    async takeActivityScreenshots() {
        const activities = Object.values(this.project.activities);
        if (activities.length === 0) {
            return;
        }

        // Revert activity
        for (const activity of activities) {
            revertActivityChanges(activity);
        }

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        const beforeCanvas = await this.screenshotService.takePageScreenshot();

        // Take before screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, beforeCanvas, true);
        }

        // Update project before screenshot
        const beforeScreenshot = beforeCanvas.toDataURL('image/png');
        this.project.hostData.beforeImage = beforeScreenshot;

        // Apply activity
        for (const activity of activities) {
            applyActivityChanges(activity);
        }

        const afterCanvas = await this.screenshotService.takePageScreenshot();

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Take after screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, afterCanvas, false);
        }

        // Update project after screenshot
        const afterScreenshot = afterCanvas.toDataURL('image/png');
        this.project.hostData.previewImage = afterScreenshot;
    }
}