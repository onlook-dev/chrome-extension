import { CustomButton, CustomColumnDiv, CustomDiv, CustomElement, CustomGridDiv, CustomRowDiv, CustomText } from "./custom";

export class ElementsManager {
  elements: Record<string, CustomElement>;
  defaultElements: Record<string, CustomElement[]> = {
    'Primitive Elements': [
      new CustomText(),
      new CustomButton(),
    ],
    "Divs & Sections": [
      new CustomDiv(),
      new CustomRowDiv(),
      new CustomColumnDiv(),
      new CustomGridDiv(),
    ]
  }
  constructor() {
    this.elements = {};
  }
}
