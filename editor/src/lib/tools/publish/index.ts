import { savePanelVisible } from "$lib/states/editor";
import { MessageType } from "$shared/message";
import { writable } from "svelte/store";

import type { Project } from "$shared/models";
import { sendMessage } from "webext-bridge/window";
import type { Tool } from "..";

export class PublishTool implements Tool {
    currentProjectStore = writable<Project | undefined>(undefined);
    projectsStore = writable<Project[]>([]);

    onInit(): void {
        savePanelVisible.set(true);
    }

    onDestroy(): void {
        savePanelVisible.set(false);
    }

    onMouseOver(el: MouseEvent): void { }
    onMouseOut(el: MouseEvent): void { }
    onClick(el: MouseEvent): void { }
    onDoubleClick(el: MouseEvent): void { }
    onScreenResize(el: Event): void { }

    public publish = (open = false) => {
        return sendMessage(MessageType.PUBLISH_PROJECT, { open });
    };

    public merge = (project: Project) => {
        return sendMessage(MessageType.MERGE_PROJECT, project as any);
    }

    getActiveProject = async (): Promise<void> => {
        const project: Project = await sendMessage(MessageType.GET_PROJECT, {}) as any;
        this.currentProjectStore.set(project);
    }

    getProjects = async (): Promise<void> => {
        const projects: Project[] = await sendMessage(MessageType.GET_PROJECTS, {}) as any[];
        this.projectsStore.set(projects);
    };

    prepare = () => {
        return sendMessage(MessageType.PREPARE_SAVE, {});
    }
}