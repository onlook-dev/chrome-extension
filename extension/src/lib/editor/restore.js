document.querySelectorAll('onlook-toolbar').forEach(node => {
  node.style.display = 'block';
  node.animate([
    // Keyframes: from current opacity to 0
    { opacity: 0 },
    { opacity: 1 }
  ], {
    // Animation options
    duration: 100, // Duration in milliseconds
    easing: 'ease-in' // Easing function
  })
});
