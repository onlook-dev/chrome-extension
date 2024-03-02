import { EditTool } from "./edit";
import { HotKeys } from "./edit/hotkeys";
export enum ToolName {
  EDIT = 'edit',
}

export interface Tool {
  onInit(): void;
  onDestroy(): void;
  onMouseOver(el: MouseEvent): void;
  onMouseOut(el: MouseEvent): void;
  onClick(el: MouseEvent): void;
  onDoubleClick(el: MouseEvent): void;
  onScreenResize(el: Event): void;
}

export class ToolManager {
  selectedTool?: Tool | undefined;
  toolMap: Record<ToolName, Tool>
  editTool: EditTool;
  hotKeys: HotKeys;

  eventsMap = {
    'mouseover': (e) => this.handleMouseOver(e),
    'mouseout': (e) => this.handleMouseOut(e),
    'click': (e) => this.handleClick(e),
    'resize': (e) => this.handleScreenResize(e),
    'dblclick': (e) => this.handleDoubleClick(e),
  };

  constructor(toolName: ToolName,) {
    this.editTool = new EditTool();
    this.hotKeys = new HotKeys(this.editTool);
    this.toolMap = {
      [ToolName.EDIT]: this.editTool,
    }
    // Set up tools
    this.setListeners();
    this.selectTool(toolName);
  }

  selectTool = (toolName?: ToolName) => {
    if (this.selectedTool) this.selectedTool.onDestroy();
    this.hotKeys.bindKeys(toolName);
    if (!toolName) {
      this.selectedTool = undefined;
      return;
    };
    this.selectedTool = this.toolMap[toolName];
    this.selectedTool.onInit();
  }

  handleMouseOver = (e: MouseEvent) => {
    if (!this.selectedTool) return;
    this.selectedTool.onMouseOver(e);
  }

  handleMouseOut = (e: MouseEvent) => {
    if (!this.selectedTool) return;
    this.selectedTool.onMouseOut(e);
  }

  handleClick = (e: MouseEvent) => {
    if (!this.selectedTool) return;
    this.selectedTool.onClick(e);
  }

  handleDoubleClick = (e: MouseEvent) => {
    if (!this.selectedTool) return;
    this.selectedTool.onDoubleClick(e);
  }

  handleScreenResize = (e: Event) => {
    if (!this.selectedTool) return;
    this.selectedTool.onScreenResize(e);
  }

  setListeners = () => {
    Object.keys(this.eventsMap).forEach(event => {
      window.addEventListener(event, this.eventsMap[event], true);
    });
  }

  removeListeners = () => {
    Object.keys(this.eventsMap).forEach(event => {
      window.removeEventListener(event, this.eventsMap[event], true);
    });
  }
}
