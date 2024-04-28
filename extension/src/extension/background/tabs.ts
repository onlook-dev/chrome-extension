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