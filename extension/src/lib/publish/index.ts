import type { ScreenshotService } from "$extension/content/screenshot";
import { hideEditor, showEditor } from "$lib/editor/helpers";
import { applyActivityChanges, revertActivityChanges } from "$lib/utils/activity";
import { baseUrl } from "$lib/utils/env";
import { projectsMapBucket } from "$lib/utils/localstorage";
import { sendOpenUrlRequest, sendSaveProject } from "$lib/utils/messaging";
import { DashboardRoutes } from "$shared/constants";
import type { Project } from "$shared/models/project";

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
            await this.screenshotService.takeScreenshot(activity, true, refresh);
            refresh = false;
        }

        // Apply activity
        for (const activity of activities) {
            applyActivityChanges(activity);
        }

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Take after screenshot
        refresh = true;
        for (const activity of activities) {
            await this.screenshotService.takeScreenshot(activity, false, refresh);
            refresh = false;
        }

        // Show UI
        showEditor()

        // Save activities in project
    }
}