import { DATA_ONLOOK_IGNORE, ONLOOK_TOOLBAR } from '$lib/constants';


const IGNORE_TAGS = ['SCRIPT', 'STYLE', ONLOOK_TOOLBAR.toUpperCase()]; // Example tags to ignore

export class LayersManager {
  clonedDocument: Document;
  originalToCloneMap: WeakMap<Node, Node>;
  cloneToOriginalMap: WeakMap<Node, Node>;

  constructor() {
    this.originalToCloneMap = new WeakMap();
    this.cloneToOriginalMap = new WeakMap();
    this.getDomTree();
  }

  cloneDOMWithReferences = (originalNode: Element) => {
    // Base case for recursion: if the node is null or not a node, return it directly
    if (!originalNode || !(originalNode instanceof Node)) {
      return originalNode;
    }

    // Skip non-element nodes (like text or comment nodes) and specific tags
    if (originalNode.nodeType !== Node.ELEMENT_NODE || IGNORE_TAGS.includes(originalNode.nodeName) || originalNode.hasAttribute(DATA_ONLOOK_IGNORE)) {
      return null;
    }

    if (originalNode.hasAttribute && originalNode.hasAttribute(DATA_ONLOOK_IGNORE)) {
      return null;
    }

    // Check if this node has already been cloned to avoid circular references
    if (this.originalToCloneMap.has(originalNode)) {
      return this.originalToCloneMap.get(originalNode);
    }

    // Create a shallow clone of the node
    const clonedNode = originalNode.cloneNode(false);

    // Save the reference in both maps
    this.originalToCloneMap.set(originalNode, clonedNode);
    this.cloneToOriginalMap.set(clonedNode, originalNode);

    // Recursively clone and append child nodes
    originalNode.childNodes.forEach((childNode: Element) => {
      const clonedChildNode = this.cloneDOMWithReferences(childNode,);
      if (clonedChildNode) {
        clonedNode.appendChild(clonedChildNode);
      }
    });

    return clonedNode;
  }

  getDomTree = () => {
    this.originalToCloneMap = new WeakMap();
    this.cloneToOriginalMap = new WeakMap();

    const clonedRoot = this.cloneDOMWithReferences(document.body);
    this.clonedDocument = document.implementation.createHTMLDocument("New Document");
    this.clonedDocument.body = clonedRoot as HTMLElement;
  }

  getSanitizedNode = (node: Node) => this.originalToCloneMap.get(node);
  getOriginalNode = (node: Node) => this.cloneToOriginalMap.get(node);
}
