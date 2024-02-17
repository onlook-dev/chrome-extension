import type EditorPanel from "$lib/components/editor/EditorPanel.svelte";
import { EditTool } from "./edit";
import { isOffBounds, deepElementFromPoint } from "./utilities";

export enum ToolName {
  EDIT = 'edit',
}

export interface Tool {
  onInit(): void;
  onDestroy(): void;
  onMouseOver(el: Element): void;
  onMouseOut(el: Element): void;
  onClick(el: Element): void;
}

export class Editor {
  selectedTool?: Tool | undefined;
  hoveredElement: Element;
  clickedElement: Element;
  editorPanel: EditorPanel;
  toolMap: Record<ToolName, Tool>

  eventsMap = {
    'mouseover': (e) => this.handleMouseOver(e),
    'mouseout': (e) => this.handleMouseOut(e),
    'click': (e) => this.handleClick(e),
    'resize': (e) => this.handleResize(e)
  };

  constructor(toolName: ToolName, editorPanel: EditorPanel) {
    this.editorPanel = editorPanel;
    this.toolMap = {
      [ToolName.EDIT]: new EditTool(editorPanel),
    }
    // Set up tools
    this.setListeners();
    this.selectTool(toolName);
  }

  selectTool = (toolName?: ToolName) => {
    if (this.selectedTool) this.selectedTool.onDestroy();
    if (!toolName) {
      this.selectedTool = undefined;
      return;
    };
    this.selectedTool = this.toolMap[toolName];
    this.selectedTool.onInit();
  }

  handleMouseOver = (e) => {
    if (!this.selectedTool) return;

    // Select and filter for non-onlook
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
    this.selectedTool.onMouseOver(target);
    this.hoveredElement = target;
  }

  handleMouseOut = (e) => {
    if (!this.selectedTool) return;

    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
    this.selectedTool.onMouseOut(target);
    this.hoveredElement = null;
  }

  handleClick = (e) => {
    if (!this.selectedTool) return;

    // Select and filter for non-onlook
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;

    e.preventDefault();
    e.stopPropagation();

    this.selectedTool.onClick(target);
    this.clickedElement = target;
  }

  handleResize = (e) => {
    if (!this.selectedTool) return;

    if (this.clickedElement) {
      this.selectedTool.onClick(this.clickedElement);
    }
    if (this.hoveredElement) {
      this.selectedTool.onMouseOver(this.hoveredElement);
    }
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
