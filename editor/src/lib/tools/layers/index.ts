import { DATA_ONLOOK_IGNORE, DATA_ONLOOK_SELECTOR } from '$lib/constants';
import DOMPurify from 'dompurify'
import { getUniqueSelector } from '../utilities';

export class LayersManager {
  domTree: any
  constructor() {
    this.getDomTree()
  }

  getDomTree = () => {
    DOMPurify.addHook('beforeSanitizeElements', (node, data, config) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.hasAttribute(DATA_ONLOOK_IGNORE)) {
          node.remove();
          return;
        }
        try {
          let selector = getUniqueSelector(node) // Make sure the unique function is defined and returns a string
          node.setAttribute(DATA_ONLOOK_SELECTOR, selector)
        } catch (e) {
          console.error(e)
        }
      }
      return node;
    });

    this.domTree = DOMPurify.sanitize(document.body.innerHTML, {
      ALLOWED_ATTR: [DATA_ONLOOK_SELECTOR],
      FORBID_TAGS: ['style', 'script', 'head'],
    })
  }
}
