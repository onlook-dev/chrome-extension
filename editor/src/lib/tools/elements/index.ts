import { CustomButton, CustomColumnDiv, CustomDiv, CustomElement, CustomImage, CustomInput, CustomRowDiv, CustomText } from "./custom";

export class ElementsManager {
  elements: Record<string, CustomElement>;
  defaultElements: Record<string, CustomElement[]> = {
    'Primitive Elements': [
      new CustomText(),
      new CustomButton(),
      new CustomInput(),
      new CustomImage(),
    ],
    "Divs & Sections": [
      new CustomDiv(),
      new CustomRowDiv(),
      new CustomColumnDiv(),
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
      const elements = this.defaultElements[category].filter(element =>
        element.title.toLowerCase().includes(filter.toLowerCase())
        || element.subtitle?.toLowerCase().includes(filter.toLowerCase())
      );
      if (elements.length > 0) {
        filteredElements[category] = elements;
      }
    });

    return filteredElements;
  }
}
