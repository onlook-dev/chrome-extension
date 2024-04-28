import { savePanelVisible, savingProject } from "$lib/states/editor";
import type { Tool } from "..";
import { MessageService, MessageType } from "$shared/message";

export class SaveTool implements Tool {
    messageService = MessageService.getInstance();
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