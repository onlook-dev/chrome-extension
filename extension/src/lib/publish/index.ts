import { hideEditor, setEditorProjectSaved, showEditor } from "$lib/editor/helpers";
import { applyActivityChanges, revertActivityChanges } from "$lib/utils/activity";
import { baseUrl } from "$lib/utils/env";
import { sendOpenUrlRequest, sendPublishProjectRequest } from "$lib/utils/messaging";
import { DashboardRoutes } from "$shared/constants";
import { ProjectStatus, type Project } from "$shared/models";
import type { ScreenshotService } from "$extension/content/screenshot";
import type { AltScreenshotService } from "$extension/content/altScreenshot";
import { projectsMapBucket } from "$lib/utils/localstorage";

export class PublishProjectService {
    constructor(
        private project: Project,
        private screenshotService: ScreenshotService,
        private altScreenshotService: AltScreenshotService
    ) { }

    public async publish() {
        if (this.project.status !== ProjectStatus.PREPARED)
            await this.prepare();

        await sendPublishProjectRequest(this.project);
        // setEditorProjectSaved();
        sendOpenUrlRequest(`${baseUrl}${DashboardRoutes.PROJECTS}/${this.project.id}`)
    }

    public async prepare() {
        if (this.project.status === ProjectStatus.PREPARED) {
            console.log("Project already prepared");
            return;
        }
        try {
            await this.takeActivityScreenshots();
        } catch (e) {
            console.error("Error taking screenshots", e);
            try {
                await this.altTakeActivityScreenshots();
            } catch (e) {
                console.error("Error taking alt screenshots", e);
            }
        }
        this.project.status = ProjectStatus.PREPARED;
        // Save locally
        projectsMapBucket.set({ [this.project.id]: this.project })
        console.log("Project prepared");
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

        // Canvas of entire page without changes
        const beforeCanvas = await this.screenshotService.takePageScreenshot();

        // Take before screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, beforeCanvas, true);
        }

        // Apply activity
        for (const activity of activities) {
            applyActivityChanges(activity);
        }

        // Canvas of entire page with changes
        const afterCanvas = await this.screenshotService.takePageScreenshot();

        // Take after screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, afterCanvas, false);
        }

        // Update project before screenshot
        const beforeScreenshot = beforeCanvas.toDataURL('image/png');
        this.project.hostData.beforeImage = beforeScreenshot;

        // Update project after screenshot
        const afterScreenshot = afterCanvas.toDataURL('image/png');
        this.project.hostData.previewImage = afterScreenshot;
    }

    async altTakeActivityScreenshots() {
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
            await this.altScreenshotService.takeActivityScreenshot(activity, true, refresh);
            refresh = false;
        }

        // Update project before screenshot
        this.project.hostData.beforeImage = await this.altScreenshotService.takePageScreenshot(false);

        // Apply activity
        for (const activity of activities) {
            applyActivityChanges(activity);
        }

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Take after screenshot
        refresh = true;
        for (const activity of activities) {
            await this.altScreenshotService.takeActivityScreenshot(activity, false, refresh);
            refresh = false;
        }

        // Update project after screenshot
        this.project.hostData.previewImage = await this.altScreenshotService.takePageScreenshot(false);

        // Show UI
        showEditor()
    }
}