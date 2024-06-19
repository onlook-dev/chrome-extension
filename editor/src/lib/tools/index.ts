import { EditTool } from "./edit";
import { PublishTool } from "./publish";

import { HotKeys } from "./hotkeys";

export enum ToolName {
  EDIT = 'edit',
  PUBLISH = 'publish',
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
  selectedToolName?: ToolName | undefined;
  toolMap: Record<ToolName, Tool>
  editTool: EditTool;
  publishTool: PublishTool;
  hotKeys: HotKeys;

  private clickTimer: any = null;
  private delay: number = 10;

  eventsMap = {
    'mouseover': (e) => this.handleMouseOver(e),
    'mouseout': (e) => this.handleMouseOut(e),
    'click': (e) => this.handleClick(e),
    'resize': (e) => this.handleScreenResize(e),
    'dblclick': (e) => this.handleDoubleClick(e),
  };

  constructor(toolName: ToolName = ToolName.EDIT) {
    this.editTool = new EditTool();
    this.publishTool = new PublishTool();

    this.hotKeys = new HotKeys(this.editTool);
    this.toolMap = {
      [ToolName.EDIT]: this.editTool,
      [ToolName.PUBLISH]: this.publishTool,
    }
    // Set up tools
    this.setListeners();
    this.selectTool(toolName);
  }

  selectTool = (toolName?: ToolName) => {
    if (toolName === this.selectedToolName) return
    if (this.selectedTool) this.selectedTool.onDestroy();
    this.hotKeys.bindKeys(toolName);
    this.selectedTool = this.toolMap[toolName] ?? undefined;
    this.selectedToolName = toolName;
    if (this.selectedTool)
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

  handleClick(e: MouseEvent): void {
    // Clear any existing timer
    if (this.clickTimer !== null) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }

    // Set a new timer
    this.clickTimer = setTimeout(() => {
      if (!this.selectedTool) return;
      this.selectedTool.onClick(e);

      this.clickTimer = null;
    }, this.delay);
  }

  handleDoubleClick(e: MouseEvent): void {
    // If double click is detected, clear the timer to prevent single click action
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }

    if (!this.selectedTool) return;
    this.selectedTool.onDoubleClick(e);
  }

  handleScreenResize = (e: Event) => {
    if (!this.selectedTool) return;
    this.selectedTool.onScreenResize(e);
  }

  setListeners = () => {
    Object.keys(this.eventsMap).forEach(event => {
      document.body.addEventListener(event, this.eventsMap[event], true);
    });
  }

  removeListeners = () => {
    Object.keys(this.eventsMap).forEach(event => {
      document.body.removeEventListener(event, this.eventsMap[event], true);
    });
  }
}
