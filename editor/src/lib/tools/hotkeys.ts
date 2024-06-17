import hotkeys from "hotkeys-js";
import { redoLastEvent, undoLastEvent } from "./edit/history";
import { ToolName } from ".";
import { ONLOOK_TOOLBAR } from "$shared/constants";
import type { EditTool } from "./edit";

hotkeys.filter = function (event) {
  var target = (event.target || event.srcElement || event.currentTarget) as HTMLElement;
  var tagName = target.tagName;
  return !(target.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA' || tagName.toLowerCase() === ONLOOK_TOOLBAR.toLowerCase());
}

export class HotKeys {
  metaKey: string;
  altKey: string;
  deleteKey: string;
  toolKeyMaps: Record<ToolName, Record<string, (e) => void>>;

  constructor(editTool: EditTool) {
    this.metaKey = window.navigator.platform.includes('Mac')
      ? 'cmd'
      : 'ctrl'

    this.altKey = window.navigator.platform.includes('Mac')
      ? 'opt'
      : 'alt'

    this.deleteKey = window.navigator.platform.includes('Mac')
      ? 'backspace'
      : 'delete'

    if (this.metaKey === 'ctrl')
      [...document.querySelectorAll('kbd')]
        .forEach(node => {
          node.textContent = node.textContent.replace('cmd', 'ctrl')
          node.textContent = node.textContent.replace('opt', 'alt')
        })

    this.toolKeyMaps = {
      [ToolName.EDIT]: {
        [`${this.metaKey}+z`]: (e) => {
          undoLastEvent()
          e.preventDefault();
          e.stopPropagation();
        },
        [`${this.metaKey}+shift+z`]: (e) => {
          redoLastEvent()
          e.preventDefault();
          e.stopPropagation();
        },
        // TODO: This is disabled for a separate task. Need to handle edge cases.
        [`${this.metaKey}+c`]: () => editTool.copyElements(),
        [`${this.metaKey}+x`]: () => editTool.cutElements(),
        [`${this.metaKey}+v`]: () => editTool.pasteElements(),
        [`${this.deleteKey}`]: (e) => {
          editTool.deleteElements()
          e.preventDefault();
          e.stopPropagation();
        },
      },
      [ToolName.PUBLISH]: {},
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

    hotkeys.unbind(allKeys.join(','));
  }
}
