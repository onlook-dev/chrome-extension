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

    public publish = () => {
        return sendMessage(MessageType.PUBLISH_PROJECT, {});
    };

    public merge = (project: Project) => {
        return sendMessage(MessageType.MERGE_PROJECT, project as any);
    }

    getActiveProject = () => {
        return sendMessage(MessageType.GET_PROJECT, {});
    }

    getProjects = () => {
        return sendMessage(MessageType.GET_PROJECTS, {});

    };

    prepare = () => {
        return sendMessage(MessageType.PREPARE_SAVE, {});
    }

}