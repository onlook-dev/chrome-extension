
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
  }
}

export class CustomText extends CustomElement {
  constructor() {
    super('Text', undefined, CustomElementType.Text);

    let text = document.createElement('p');
    text.textContent = "Lorem ipsum";
    text.style.margin = "0";
    text.style.padding = "0";
    text.style.fontSize = "16px";
    text.style.lineHeight = "1.5";
    text.style.textAlign = "left";
    text.style.width = "100%";
    text.style.height = "auto";

    this.element = text;
  }
}

export class CustomButton extends CustomElement {
  constructor() {
    super('Button', undefined, CustomElementType.Button);

    let button = document.createElement('button');
    button.textContent = "Button";
    button.style.backgroundColor = "#007bff";
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
    button.style.width = "100%";
    button.style.height = "auto";
    button.style.textAlign = "center";

    this.element = button
  }
}

export class CustomInput extends CustomElement {
  constructor() {
    super('Input', "A text input", CustomElementType.Input);

    let input = document.createElement('input');
    input.style.width = "100%";
    input.style.height = "auto";
    input.style.padding = "10px";
    input.style.fontSize = "16px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";
    input.style.boxSizing = "border-box";

    this.element = input;
  }
}

export class CustomImage extends CustomElement {
  constructor() {
    super('Image', undefined, CustomElementType.Image);

    let image = document.createElement('img');
    image.style.width = "100%";
    image.style.height = "auto";
    image.src = "https://picsum.photos/200/300";
    this.element = image;
  }
}

export class CustomVideo extends CustomElement {
  constructor() {
    super('Video', undefined, CustomElementType.Video);

    let video = document.createElement('video');
    video.style.width = "100%";
    video.style.height = "auto";

    this.element = video;
  }
}

export class CustomDiv extends CustomElement {
  constructor() {
    super('Div', "Container where you’d put content", CustomElementType.Div);

    let div = document.createElement('div');
    div.style.width = "100%";
    div.style.height = "auto";

    this.element = div;
  }
}

export class CustomRowDiv extends CustomElement {
  constructor() {
    super('Row Div', "Container with elements side-by-side", CustomElementType.RowDiv);

    let div = document.createElement('div');
    div.style.width = "100%";
    div.style.height = "auto";
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    this.element = div;
  }
}

export class CustomColumnDiv extends CustomElement {
  constructor() {
    super('Column Div', "Container with elements vertically stacked", CustomElementType.ColumnDiv);

    let div = document.createElement('div');
    div.style.width = "100%";
    div.style.height = "auto";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    this.element = div;
  }
}

export class CustomGridDiv extends CustomElement {
  constructor() {
    super('Grid Div', "Container with elements in a fixed grid", CustomElementType.GridDiv);

    let div = document.createElement('div');
    div.style.width = "100%";
    div.style.height = "auto";
    div.style.display = "grid";
    div.style.gridTemplateColumns = "repeat(3, 1fr)";
    div.style.gridGap = "10px";

    this.element = div;
  }
}
