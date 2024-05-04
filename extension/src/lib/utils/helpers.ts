export const consoleLogImage = function (url: string, size = 10) {
    const image = new Image();
    image.src = url;
    image.onload = function () {
        var style = [
            'font-size: 1px;',
            // @ts-ignore
            'padding: ' + this.height / 100 * size + 'px ' + this.width / 100 * size + 'px;',
            'background: url(' + url + ') no-repeat;',
            'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
    };
};

export function forwardToActiveTab(detail: any, callback: any) {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
        // If tab is not active, don't send message
        const activeTab = tabs[0]
        if (!activeTab) return

        // Forward to callback
        callback(detail, {
            tabId: activeTab.id
        })
    })
}