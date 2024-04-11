
let lastCaptured = 0
let dataUri = ''

export async function captureActiveTab(): Promise<string> {
    return new Promise((resolve, reject) => {
        // If within 1 second, return the existing dataUri 
        // This is to prevent multiple calls to captureVisibleTab
        if (Date.now() - lastCaptured > 1000) {
            chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
                const tab = tabs[0]
                if (!tab) return
                dataUri = await captureTab(tab.windowId as number)
                lastCaptured = Date.now()
                resolve(dataUri)
            })
        } else {
            resolve(dataUri)
        }
    })

}

export async function captureTab(windowId: number): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg' }, dataUri => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(dataUri)
            }
        })
    })
}