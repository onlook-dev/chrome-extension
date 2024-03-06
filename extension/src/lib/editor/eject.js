document.querySelectorAll('onlook-toolbar').forEach((node) => {
  node.setAttribute('data-onlook-eject', 'true');

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
    // @ts-ignore - style does exist
    node.style.display = 'none';
  };
});

// Hide rectangles 
document.querySelectorAll(`#onlook-rect`).forEach(node => {
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
    // @ts-ignore - style does exist
    node.style.display = 'none';
  };
});
