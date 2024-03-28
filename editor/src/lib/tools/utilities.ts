import { DATA_ONLOOK_ID, ONLOOK_TOOLBAR } from '$shared/constants'
import { finder } from '$lib/tools/selection/uniqueSelector'

export const deepElementFromPoint = (x, y): HTMLElement => {
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

export const isOffBounds = node => node?.closest && (node.closest(ONLOOK_TOOLBAR) || node.closest(`#${ONLOOK_TOOLBAR}`))

export const getDataOnlookId = node => node?.getAttribute(DATA_ONLOOK_ID)

export const getByDataOnlookId = id => document.querySelectorAll(`[${DATA_ONLOOK_ID}="${id}"]`)

export const findCommonParent = (...nodes): HTMLElement => {
  // Early exit if there's only one node or no nodes
  if (nodes.length === 0) return document.body;
  if (nodes.length === 1) return nodes[0].parentNode || document.body;

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

export const getUniqueSelector = (el: HTMLElement): string => {
  let selector = el.tagName.toLowerCase()
  try {
    if (el.nodeType !== Node.ELEMENT_NODE) { return selector }
    selector = finder(el, { className: () => false })
  } catch (e) {
    console.error("Error creating selector ", e);
  }
  return selector
}