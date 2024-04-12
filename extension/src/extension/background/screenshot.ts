
let lastCaptured = 0
let dataUri = ''

export async function captureActiveTab(refresh = false): Promise<string> {
    return new Promise((resolve, reject) => {
        const buffer = 1001;
        const capture = async () => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const tab = tabs[0];
                if (!tab) {
                    reject('No active tab found.');
                    return;
                }
                console.log(`Capturing tab ${tab.id}`);
                dataUri = await captureTab(tab.windowId);
                lastCaptured = Date.now();
                resolve(dataUri);
            } catch (error) {
                reject(`Failed to capture tab: ${error}`);
            }
        };

        console.log(refresh)

        if (!dataUri) {
            capture();
            return;
        }

        const timeSinceLastCapture = Date.now() - lastCaptured;
        if (timeSinceLastCapture <= buffer) {
            if (refresh) {
                console.log(`Waiting ${buffer - timeSinceLastCapture}ms before capturing`);
                setTimeout(capture, buffer - timeSinceLastCapture);
            } else {
                console.log('Returning cached dataUri');
                resolve(dataUri);
            }
        } else {
            console.log('Capturing immediately');
            capture();
        }
    });
}

export async function captureTab(windowId: number): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg' }, uri => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(uri)
            }
        })
    })
}