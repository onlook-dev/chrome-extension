document.querySelectorAll('onlook-toolbar').forEach(node => {
  node.animate([
    // Keyframes: from current opacity to 0
    { opacity: 1 },
    { opacity: 0 }
  ], {
    // Animation options
    duration: 100, // Duration in milliseconds
    easing: 'ease-out' // Easing function
  }).onfinish = () => {
    // Set display to none after animation completes
    node.style.display = 'none';
  };
});
