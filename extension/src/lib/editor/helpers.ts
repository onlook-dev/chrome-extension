import { ONLOOK_TOOLBAR, ONLOOK_RECT_ID, DATA_ONLOOK_SAVED } from "$shared/constants";

let hidden = false
export const hideEditor = () => {
    try {
        if (hidden) return
        document.querySelectorAll(ONLOOK_TOOLBAR).forEach((node: any) => {
            node.style.opacity = '0';
        });

        // Hide rectangles 
        document.querySelectorAll(`#${ONLOOK_RECT_ID}`).forEach((node: any) => {
            node.style.opacity = '0';
        });
        hidden = true
    } catch (e) {
        console.error(e);
    }

}

export const showEditor = () => {
    try {
        document.querySelectorAll(ONLOOK_TOOLBAR).forEach((node: any) => {
            node.style.opacity = '1';
        });

        // Show rectangles 
        document.querySelectorAll(`#${ONLOOK_RECT_ID}`).forEach((node: any) => {
            node.style.opacity = '1';
        });
        hidden = false
    } catch (e) {
        console.error(e);
    }
}

export const setEditorProjectSaved = () => {
    try {
        document.querySelectorAll(ONLOOK_TOOLBAR).forEach((node: any) => {
            node.setAttribute(DATA_ONLOOK_SAVED, 'true');
        });
    } catch (e) {
        console.error(e);
    }
}