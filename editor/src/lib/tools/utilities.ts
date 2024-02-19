export const deepElementFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y)

  const crawlShadows = node => {
    if (node?.shadowRoot) {
      const potential = node.shadowRoot.elementFromPoint(x, y)

      if (potential == node) return node
      else if (potential.shadowRoot) return crawlShadows(potential)
      else return potential
    }
    else return node
  }

  const nested_shadow = crawlShadows(el)

  return nested_shadow || el
}


export const isOffBounds = node => node?.closest && (node.closest('onlook-toolbar') || node.closest('#onlook-toolbar'))

export const getDataOnlookId = node => node?.getAttribute('data-onlook-id')

export function findCommonParent(...nodes) {
  // Early exit if there's only one node or no nodes
  if (nodes.length <= 1) return nodes[0] || null;

  // Function to calculate the depth of a node in the DOM tree
  function getNodeDepth(node) {
    let depth = 0;
    while (node.parentNode) {
      node = node.parentNode;
      depth++;
    }
    return depth;
  }

  // Get depths of all nodes
  const depths = nodes.map(node => getNodeDepth(node));

  // Align all nodes at the same depth
  nodes.forEach((node, i) => {
    while (depths[i] > Math.min(...depths)) {
      node = node.parentNode;
      depths[i]--;
    }
    nodes[i] = node; // Update the node in the array to its ancestor at the aligned depth
  });

  // Walk up the tree simultaneously until a common parent is found
  let commonParent = nodes[0];
  while (!nodes.every(node => node === commonParent)) {
    commonParent = commonParent.parentNode;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] !== commonParent) {
        nodes[i] = nodes[i].parentNode;
      }
    }
  }

  return commonParent;
}
