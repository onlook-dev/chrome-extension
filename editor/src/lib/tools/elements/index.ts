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

  getFilteredDefaultElements(filter: string): Record<string, CustomElement[]> {
    if (!filter || filter === "") {
      return this.defaultElements;
    }
    const filteredElements: Record<string, CustomElement[]> = {};

    Object.keys(this.defaultElements).forEach((category) => {
      const elements = this.defaultElements[category].filter(element => element.title.toLocaleLowerCase().includes(filter.toLowerCase()));
      if (elements.length > 0) {
        filteredElements[category] = elements;
      }
    });

    return filteredElements;
  }
}
