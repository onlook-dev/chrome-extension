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

        // Hide UI
        hideEditor();

        // Revert activity
        for (const activity of activities) {
            revertActivityChanges(activity);
        }

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Take before screenshot
        let refresh = true;
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, true, refresh);
            refresh = false;
        }

        const beforePageScreenshot = await this.screenshotService.takePageScreenshot(false);
        this.project.hostData.beforeImage = beforePageScreenshot;

        // Apply activity
        for (const activity of activities) {
            applyActivityChanges(activity);
        }

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Take after screenshot
        refresh = true;
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, false, refresh);
            refresh = false;
        }
        this.project.hostData.previewImage = await this.screenshotService.takePageScreenshot(false);

        // Show UI
        showEditor()
    }
}