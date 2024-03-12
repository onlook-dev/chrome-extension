// @ts-ignore - Browser exists in context 
var platform = typeof browser === 'undefined' ? chrome : browser

const onlookScript = document.createElement('script')
onlookScript.type = 'module'
onlookScript.src = platform.runtime.getURL('src/lib/editor/bundle.min.js')
document.body.appendChild(onlookScript)

const onlookToolbar = document.createElement('onlook-toolbar')
document.body.append(onlookToolbar)
