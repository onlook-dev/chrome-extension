import { elementStyleUnits } from "../edit/units"

export interface ElementStyle {
  key: string
  value: string
  displayName: string
  type: ElementStyleType
  group: ElementStyleGroup

  // Optional depending on types
  options?: string[]
  units?: string[]
  max?: number
}

export enum ElementStyleType {
  Text = 'text',
  Dimensions = 'dimensions',
  Number = 'number',
  Select = 'select',
  Color = 'color'
}

export enum ElementStyleGroup {
  Size = 'Size',
  Position = 'Position & Dimensions',
  Layout = 'Layout',
  Style = 'Styles',
  Text = 'Text',
  Spacing = 'Padding & Margin',
  Effects = 'Effects',
}

// Custom order for the groups
const groupOrder: ElementStyleGroup[] = [
  ElementStyleGroup.Size,
  ElementStyleGroup.Position,
  ElementStyleGroup.Layout,
  ElementStyleGroup.Style,
  ElementStyleGroup.Text,
  ElementStyleGroup.Layout,
  ElementStyleGroup.Effects,
];

export class ElementStyle implements ElementStyle {
  constructor(
    key: string,
    value: string,
    displayName: string,
    type: ElementStyleType,
    group: ElementStyleGroup,

    // Optional
    options?: string[],
    units?: string[],
    max?: number
  ) {
    this.key = key
    this.value = value
    this.displayName = displayName
    this.type = type
    this.group = group
    this.options = options
    this.units = units
    this.max = max
  }
}

// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

// Position: height, width
// Layout: type, direction, distribute, X align, Y align, Gap, Padding, Margin
// Style: opacity, fill (backgroundColor), Corners (cornerRadius and for each corner), Borders (border color, border weight), Position, Shadows (same as border)
// Text: color fontSize fontWeight letterSpacing lineHeight textAlign 
// Effect: shadow border

export const elementStyles: ElementStyle[] = [
  // Position & Dimenions
  new ElementStyle(
    'width',
    '',
    'Width',
    ElementStyleType.Dimensions,
    ElementStyleGroup.Position,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'height',
    '',
    'Height',
    ElementStyleType.Dimensions,
    ElementStyleGroup.Position,
    [],
    elementStyleUnits,
    1000
  ),

  // Layout
  new ElementStyle(
    'display',
    'flex',
    'Display',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['flex', 'grid']
  ),

  new ElementStyle(
    'flexDirection',
    'row',
    'Direction',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['row', 'column']
  ),

  new ElementStyle(
    'justifyContent',
    'flex-start',
    'Y Align',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['flex-start', 'center', 'flex-end', 'stretch']
  ),

  new ElementStyle(
    'alignItems',
    'flex-start',
    'X Align',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['flex-start', 'center', 'flex-end', 'stretch']
  ),

  new ElementStyle(
    'gap',
    '0px',
    'Gap',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),

  new ElementStyle(
    'margin',
    '',
    'Margin',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),

  new ElementStyle(
    'marginTop',
    '',
    'Margin Top',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'marginRight',
    '',
    'Margin Right',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'marginBottom',
    '',
    'Margin Bottom',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'marginLeft',
    '',
    'Margin Left',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),

  new ElementStyle(
    'padding',
    '',
    'Padding',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),

  new ElementStyle(
    'paddingTop',
    '',
    'Padding Top',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'paddingRight',
    '',
    'Padding Right',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'paddingBottom',
    '',
    'Padding Bottom',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'paddingLeft',
    '',
    'Padding Left',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  // Style
  new ElementStyle(
    'opacity',
    '100',
    'Opacity',
    ElementStyleType.Number,
    ElementStyleGroup.Style,
    [],
    ['%'],
    1
  ),
  new ElementStyle(
    'overflow',
    'visible',
    'Overflow',
    ElementStyleType.Select,
    ElementStyleGroup.Style,
    ['visible', 'hidden', 'scroll', 'auto']
  ),

  new ElementStyle(
    'backgroundColor',
    '',
    'Fill',
    ElementStyleType.Color,
    ElementStyleGroup.Style
  ),

  // Text
  new ElementStyle(
    'color',
    '#000000',
    'Color',
    ElementStyleType.Color,
    ElementStyleGroup.Text
  ),

  new ElementStyle(
    'fontSize',
    '16px',
    'Size',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    [],
    elementStyleUnits,
    100
  ),
  new ElementStyle(
    'fontWeight',
    'normal',
    'Weight',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    [
      'lighter',
      'normal',
      'bold',
      'bolder',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  ),
  new ElementStyle(
    'letterSpacing',
    '0px',
    'Letter',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    [],
    elementStyleUnits,
    100
  ),
  new ElementStyle(
    'lineHeight',
    '100%',
    'Line Height',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    [],
    elementStyleUnits,
    100
  ),
  new ElementStyle(
    'textAlign',
    'start',
    'Align',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    ['start', 'center', 'end',]
  ),
]

export function sortGroupsByCustomOrder(groups: Record<string, ElementStyle[]>): Record<string, ElementStyle[]> {
  const sortedGroups: Record<string, ElementStyle[]> = {};

  // Iterate through the groupOrder array to ensure custom order
  groupOrder.forEach(group => {
    if (groups[group]) { // Check if the group exists in the input groups
      sortedGroups[group] = groups[group];
    }
  });

  return sortedGroups;
}

export function groupElementStylesByGroup(styles: ElementStyle[]): Record<ElementStyleGroup, ElementStyle[]> {
  return styles.reduce((groups: any, style) => {
    // Initialize the group if it doesn't exist
    if (!groups[style.group]) {
      groups[style.group] = []
    }
    // Add the current style to the correct group
    groups[style.group].push(style)
    return sortGroupsByCustomOrder(groups)
  }, {})
}

export function getElementComputedStylesData(el: HTMLElement) {
  // Retrieve all computed styles for the clicked element
  const computedStyles = getComputedStyle(el)
  // TODO: Could get styles based on tag types
  elementStyles.forEach((style: any) => {
    const inlineStyle = el.style[style.key]
    const computedStyle = computedStyles[style.key]
    if (style.type === ElementStyleType.Number) {
      style.value = (inlineStyle && inlineStyle !== '') ? inlineStyle : computedStyle
    } else if (style.type === ElementStyleType.Color) {
      style.value = computedStyle
    } else {
      style.value = inlineStyle && inlineStyle !== '' ? inlineStyle : computedStyle
    }
  })

  return elementStyles
}

export let getImmediateTextContent = (el: HTMLElement) => {
  return [].reduce.call(el.childNodes, function (a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '').trim();
}