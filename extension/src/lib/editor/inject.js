function addCustomElements() {
  const ONLOOK_TOOLBAR_TAG = 'onlook-toolbar';
  // @ts-ignore - Browser exists in context 
  var platform = typeof browser === 'undefined' ? chrome : browser;

  // Check if the elements are already added to prevent duplicates
  if (!document.querySelector(ONLOOK_TOOLBAR_TAG)) {
    const onlookScript = document.createElement('script');
    onlookScript.type = 'module';
    onlookScript.src = platform.runtime.getURL('src/lib/editor/bundle.min.js');
    document.body.appendChild(onlookScript);

    const onlookToolbar = document.createElement(ONLOOK_TOOLBAR_TAG);
    document.body.append(onlookToolbar);
  }
}

// Initialize MutationObserver
const toolbarMutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      // Rerun adding custom element if children are mutated
      addCustomElements();
    }
  });
});

// Start observing the body for changes in children
toolbarMutationObserver.observe(document.body, { childList: true });

// Also run the function initially in case the DOM is already in the desired state
addCustomElements();
