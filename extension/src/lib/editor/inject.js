
var platform = typeof browser === 'undefined' ? chrome : browser

const script = document.createElement('script')
script.type = 'module'
script.src = platform.runtime.getURL('src/lib/editor/bundle.min.js')
document.body.appendChild(script)

const onlook = document.createElement('onlook-toolbar')
document.body.append(onlook)
