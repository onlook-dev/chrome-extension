import { hideEditor, showEditor } from "$lib/editor/helpers";
import { baseUrl } from "$lib/utils/env";
import { sendOpenUrlRequest, sendPublishProjectRequest } from "$lib/utils/messaging";
import { DashboardRoutes } from "$shared/constants";
import { projectsMapBucket } from "$lib/utils/localstorage";
import { ProjectStatus, type Project } from "$shared/models";
import type { ScreenshotService } from "$extension/content/screenshot";
import type { AltScreenshotService } from "$extension/content/altScreenshot";
import type { ProjectChangeService } from "$lib/projects/changes";
import { consoleLogImage } from "$lib/utils/helpers";

export class PublishProjectService {
    constructor(
        private project: Project,
        private screenshotService: ScreenshotService,
        private altScreenshotService: AltScreenshotService,
        private projectChangeService: ProjectChangeService
    ) { }

    public async publish(open = true) {
        if (this.project.status !== ProjectStatus.PREPARED)
            await this.prepare();

        await sendPublishProjectRequest(this.project);
        if (open)
            sendOpenUrlRequest({ url: `${baseUrl}${DashboardRoutes.PROJECTS}/${this.project.id}` })
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
        await projectsMapBucket.set({ [this.project.id]: this.project })
    }

    async takeActivityScreenshots() {
        const activities = Object.values(this.project.activities);
        if (!this.project.hostData) {
            this.project.hostData = {};
        }

        if (activities.length === 0) return;

        // Revert activity
        this.projectChangeService.applyProjectChanges(this.project, true);

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Canvas of entire page without changes
        const beforeCanvas = await this.screenshotService.takePageScreenshot();

        // Take before screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, beforeCanvas, true);
        }

        // Update project before screenshot
        const beforeScreenshot = beforeCanvas.toDataURL('image/png');
        this.project.hostData.beforeImage = beforeScreenshot;

        // Apply activity
        this.projectChangeService.applyProjectChanges(this.project);

        // Wait for changes to apply
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Canvas of entire page with changes
        const afterCanvas = await this.screenshotService.takePageScreenshot();

        // Take after screenshot
        for (const activity of activities) {
            await this.screenshotService.takeActivityScreenshot(activity, afterCanvas, false);
        }

        // Update project after screenshot
        const afterScreenshot = afterCanvas.toDataURL('image/png');
        this.project.hostData.previewImage = afterScreenshot;

        consoleLogImage(afterScreenshot);
    }

    async altTakeActivityScreenshots() {
        const activities = Object.values(this.project.activities);
        if (!this.project.hostData) {
            this.project.hostData = {};
        }

        if (activities.length === 0) {
            if (!this.project.hostData.previewImage)
                this.project.hostData.previewImage = await this.altScreenshotService.takePageScreenshot(false);
            return;
        }

        // Hide UI
        hideEditor();

        // Revert activity
        this.projectChangeService.applyProjectChanges(this.project, true);

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
        this.projectChangeService.applyProjectChanges(this.project);

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