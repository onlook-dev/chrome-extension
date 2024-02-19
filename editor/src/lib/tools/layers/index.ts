import { DATA_ONLOOK_IGNORE } from '$lib/constants';
import DOMPurify from 'dompurify'

export class LayersManager {
  domTree: any
  constructor() {
    this.getDomTree()
  }

  getDomTree = () => {
    DOMPurify.addHook('beforeSanitizeElements', (node, data, config) => {
      if (node.nodeType === 1 && node.hasAttribute(DATA_ONLOOK_IGNORE)) {
        node.remove();
      }
      return node;
    });

    this.domTree = DOMPurify.sanitize(document.body.innerHTML, {
      FORBID_TAGS: ['style', 'script', 'head'],
    })
  }
}
