
let hidden = false
export const hideEditor = () => {
    try {
        if (hidden) return
        document.querySelectorAll('onlook-toolbar').forEach((node: any) => {
            node.style.opacity = '0';
        });

        // Hide rectangles 
        document.querySelectorAll(`#onlook-rect`).forEach((node: any) => {
            node.style.opacity = '0';
        });
        hidden = true
    } catch (e) {
        console.error(e);
    }

}

export const showEditor = () => {
    try {
        document.querySelectorAll('onlook-toolbar').forEach((node: any) => {
            node.style.opacity = '1';
        });

        // Show rectangles 
        document.querySelectorAll(`#onlook-rect`).forEach((node: any) => {
            node.style.opacity = '1';
        });
        hidden = false
    } catch (e) {
        console.error(e);
    }
}