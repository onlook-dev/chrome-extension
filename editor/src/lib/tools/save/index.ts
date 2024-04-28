import { savePanelVisible, savingProject } from "$lib/states/editor";
import { MessageService, MessageType } from "$shared/message";

import type { Tool } from "..";
import type { Project } from "$shared/models";
import { get, writable } from "svelte/store";

export class SaveTool implements Tool {
    messageService = MessageService.getInstance();
    currentProjectStore = writable<Project | undefined>(undefined);

    onInit(): void {
        savePanelVisible.set(true);
        this.getActiveProject().then((project: Project) => {
            this.currentProjectStore.set(project)
        })
    }

    onDestroy(): void {
        savePanelVisible.set(false);
    }

    onMouseOver(el: MouseEvent): void { }
    onMouseOut(el: MouseEvent): void { }
    onClick(el: MouseEvent): void { }
    onDoubleClick(el: MouseEvent): void { }
    onScreenResize(el: Event): void { }

    private getActiveProject = () => {
        return new Promise((resolve, reject) => {
            this.messageService.publish(MessageType.GET_PROJECT, {}, (project: Project) => {
                resolve(project);
            });
        })
    }

    prepareSave = () => {
        savingProject.set(true);
        this.messageService.publish(MessageType.SAVE_PROJECT)
        // Just in case, disable saving state after 10 seconds
        setTimeout(() => savingProject.set(false), 10000);
    }

    save = () => {
        console.log('Save');
    }

    listenForMessages = () => {

    }
}