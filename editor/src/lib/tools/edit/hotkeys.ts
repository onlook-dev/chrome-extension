import hotkeys from "hotkeys-js";
import { redoLastEvent, undoLastEvent } from "./history";
import { ToolName } from "..";

export class HotKeys {
  metaKey: string;
  altKey: string;
  toolKeyMaps: Record<ToolName, Record<string, () => void>>;

  constructor() {
    this.metaKey = window.navigator.platform.includes('Mac')
      ? 'cmd'
      : 'ctrl'

    this.altKey = window.navigator.platform.includes('Mac')
      ? 'opt'
      : 'alt'

    if (this.metaKey === 'ctrl')
      [...document.querySelectorAll('kbd')]
        .forEach(node => {
          node.textContent = node.textContent.replace('cmd', 'ctrl')
          node.textContent = node.textContent.replace('opt', 'alt')
        })

    this.toolKeyMaps = {
      [ToolName.EDIT]: {
        [`${this.metaKey}+z`]: () => undoLastEvent(),
        [`${this.metaKey}+shift+z`]: () => redoLastEvent()
      }
    }
  }

  bindKeys = (toolName?: ToolName) => {
    this.unbindAllKeys();
    if (!toolName) return;
    const toolKeyMap = this.toolKeyMaps[toolName];
    Object.keys(toolKeyMap).forEach(key => {
      hotkeys(key, toolKeyMap[key]);
    })
  }

  unbindAllKeys = () => {
    const allKeys = Object.values(this.toolKeyMaps).reduce((acc, toolKeyMap) => {
      return acc.concat(Object.keys(toolKeyMap));
    }, []);

    allKeys.forEach(key => {
      try {
        hotkeys.unbind(key);
      } catch (e) {
        console.error(e);
      }
    })
  }
}
