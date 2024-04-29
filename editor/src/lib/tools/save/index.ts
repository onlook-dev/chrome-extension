import { savePanelVisible, savingProject } from "$lib/states/editor";
import { MessageService, MessageType } from "$shared/message";
import { writable } from "svelte/store";

import retry from 'async-retry';

import type { Tool } from "..";
import type { Project } from "$shared/models";

export class SaveTool implements Tool {
    messageService = MessageService.getInstance();
    currentProjectStore = writable<Project | undefined>(undefined);
    projectsStore = writable<Project[]>([]);

    onInit(): void {
        savePanelVisible.set(true);
        this.getActiveProject().then((project: Project) => {
            this.currentProjectStore.set(project)
        })

        this.getProjects().then((projects: Project[]) => {
            this.projectsStore.set(projects);
        })

        // Create screenshots
        this.prepareSave();
    }

    onDestroy(): void {
        savePanelVisible.set(false);
    }

    onMouseOver(el: MouseEvent): void { }
    onMouseOut(el: MouseEvent): void { }
    onClick(el: MouseEvent): void { }
    onDoubleClick(el: MouseEvent): void { }
    onScreenResize(el: Event): void { }

    // TODO: This could be its own helper 
    publishWithTimeout(messageType, payload, retries = 3, factor = 2, minTimeout = 1000, timeout = 5000) {
        return retry(() => {
            return new Promise((resolve, reject) => {
                let timeoutHandle = setTimeout(() => {
                    reject(new Error('Timeout waiting for response'));
                }, timeout);

                this.messageService.publish(messageType, payload, (response) => {
                    clearTimeout(timeoutHandle);
                    if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('No response received'));
                    }
                });
            });
        }, {
            retries: retries,
            factor: factor,
            minTimeout: minTimeout,
            onRetry: (err, attempt) => {
                console.log(`Attempt ${attempt}: Retrying ${messageType}`);
            }
        });
    }

    private getActiveProject = () => {
        return this.publishWithTimeout(MessageType.GET_PROJECT, {}, 3, 2, 1000, 3000);
    }

    private getProjects = () => {
        return this.publishWithTimeout(MessageType.GET_PROJECTS, {}, 3, 2, 1000, 3000);
    };

    private prepareSave = () => {
        this.publishWithTimeout(MessageType.PREPARE_SAVE, {}, 3, 2, 1000, 3000);
        // Saving state if needed
        // savingProject.set(true);
        // setTimeout(() => savingProject.set(false), 10000);
    }

    save = () => {
        console.log('Save');
    }

    listenForMessages = () => {

    }
}