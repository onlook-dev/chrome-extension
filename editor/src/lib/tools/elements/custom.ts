import { nanoid } from 'nanoid';

export enum CustomElementType {
  Text = "Text",
  Button = "Button",
  Image = "Image",
  Input = "Input",
  Video = "Video",
  Div = "Div",
  RowDiv = "Row Div",
  ColumnDiv = "Column Div",
  GridDiv = "Grid Div",
}

export class CustomElement {
  title: string;
  subtitle?: string | undefined;
  element: HTMLElement;
  type: CustomElementType;

  constructor(title: string, subtitle: string | undefined, type: CustomElementType) {
    this.title = title;
    this.subtitle = subtitle;
    this.type = type;
    this.element = this.getElement();
  }

  getElement(): HTMLElement {
    return document.createElement('div');
  }
}

export class CustomText extends CustomElement {
  constructor() {
    super('Text', undefined, CustomElementType.Text);
  }

  getElement(): HTMLElement {
    const text = document.createElement('p');
    text.textContent = "Lorem ipsum";
    text.style.margin = "0";
    text.style.padding = "0";
    text.style.textAlign = "left";
    text.style.width = "auto";
    text.style.height = "auto";

    text.dataset.onlookComponentId = `p-${nanoid()}`
    return text;
  }
}

export class CustomButton extends CustomElement {
  constructor() {
    super('Button', undefined, CustomElementType.Button);
  }

  getElement(): HTMLElement {
    const button = document.createElement('button');

    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.whiteSpace = "normal"; // Allow text to wrap
    button.style.overflow = "hidden"; // Prevent overflow
    button.style.textOverflow = "ellipsis"; // Add an ellipsis if text overflows
    button.style.display = "inline-block"; // Make sure button respects width constraints
    button.style.width = "auto";
    button.style.height = "auto";
    button.style.textAlign = "center";
    button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    button.dataset.onlookComponentId = `button-${nanoid()}`

    const span = document.createElement('span');
    span.textContent = "Click Me";
    span.dataset.onlookComponentId = `span-${nanoid()}`
    button.appendChild(span);

    return button;
  }
}

export class CustomInput extends CustomElement {
  constructor() {
    super('Input', "A text input", CustomElementType.Input);
  }

  getElement(): HTMLElement {
    const input = document.createElement('input');
    input.style.width = "100px";
    input.style.height = "auto";
    input.style.padding = "10px";
    input.style.fontSize = "16px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";
    input.style.boxSizing = "border-box";

    input.dataset.onlookComponentId = `input-${nanoid()}`
    return input;
  }
}

export class CustomImage extends CustomElement {
  constructor() {
    super('Image', undefined, CustomElementType.Image);
  }

  getElement(): HTMLElement {
    const image = document.createElement('img');
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.src = "https://picsum.photos/300/200";

    image.dataset.onlookComponentId = `img-${nanoid()}`
    return image;
  }
}

export class CustomDiv extends CustomElement {
  constructor() {
    super('Div', "Container where you'd put content", CustomElementType.Div);
  }

  getElement(): HTMLElement {
    const div = document.createElement('div');
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.backgroundColor = "#75FB9E"
    div.dataset.onlookComponentId = `div-${nanoid()}`
    return div;
  }
}

export class CustomRowDiv extends CustomElement {
  constructor() {
    super('Row Div', "Container with elements side-by-side", CustomElementType.RowDiv);
  }

  getElement(): HTMLElement {
    const div = document.createElement('div');
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.backgroundColor = "#75FB9E"

    div.dataset.onlookComponentId = `div-${nanoid()}`
    return div;
  };
}

export class CustomColumnDiv extends CustomElement {
  constructor() {
    super('Column Div', "Container with elements vertically stacked", CustomElementType.ColumnDiv);
  }

  getElement(): HTMLElement {
    const div = document.createElement('div');
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.backgroundColor = "#75FB9E"
    div.dataset.onlookComponentId = `div-${nanoid()}`
    return div
  }
}

export class CustomGridDiv extends CustomElement {
  constructor() {
    super('Grid Div', "Container with elements in a fixed grid", CustomElementType.GridDiv);
  }

  getElement(): HTMLElement {
    const div = document.createElement('div');
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.height = "auto";
    div.style.display = "grid";
    div.style.gridTemplateColumns = "repeat(3, 1fr)";
    div.style.gap = "10px";

    div.dataset.onlookComponentId = `div-${nanoid()}`
    return div
  }
}
