function addCustomElements() {
  // @ts-ignore - Browser exists in context 
  var platform = typeof browser === 'undefined' ? chrome : browser;

  // Check if the elements are already added to prevent duplicates
  if (!document.querySelector('onlook-toolbar')) {
    const onlookScript = document.createElement('script');
    onlookScript.type = 'module';
    onlookScript.src = platform.runtime.getURL('src/lib/editor/bundle.min.js');
    document.body.appendChild(onlookScript);

    const onlookToolbar = document.createElement('onlook-toolbar');
    document.body.append(onlookToolbar);
  }
}

// Initialize MutationObserver
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      addCustomElements();
    }
  });
});

// Specify what to observe
const config = { childList: true, subtree: true };

// Start observing the body for changes in children
observer.observe(document.body, config);

// Also run the function initially in case the DOM is already in the desired state
addCustomElements();
