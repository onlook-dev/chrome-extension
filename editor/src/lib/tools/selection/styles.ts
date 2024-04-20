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
  subGroup?: ElementStyleSubGroup
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
  Effects = 'Effects',
}

export enum ElementStyleSubGroup {
  Margin = 'Margin',
  Padding = 'Padding',
  Border = 'Border',
  Shadow = 'Shadow',
}

// Custom order for the groups
const groupOrder: (string)[] = [
  ElementStyleGroup.Size,
  ElementStyleGroup.Position,
  ElementStyleGroup.Layout,
  ElementStyleSubGroup.Margin,
  ElementStyleSubGroup.Padding,
  ElementStyleGroup.Style,
  ElementStyleSubGroup.Border,
  ElementStyleSubGroup.Shadow,
  ElementStyleGroup.Text,
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
    optional?: {
      options?: string[],
      units?: string[],
      max?: number,
      subGroup?: ElementStyleSubGroup
    }
  ) {
    this.key = key
    this.value = value
    this.displayName = displayName
    this.type = type
    this.group = group

    if (!optional) return
    this.options = optional.options || []
    this.units = optional.units
    this.max = optional.max
    this.subGroup = optional.subGroup
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
    {
      units: elementStyleUnits,
      max: 1000
    }
  ),
  new ElementStyle(
    'height',
    '',
    'Height',
    ElementStyleType.Dimensions,
    ElementStyleGroup.Position,
    {
      units: elementStyleUnits,
      max: 1000
    }
  ),

  // Layout
  new ElementStyle(
    'display',
    'flex',
    'Type',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    { options: ['flex', 'grid', 'block'] }
  ),

  new ElementStyle(
    'flexDirection',
    'row',
    'Direction',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    { options: ['row', 'column'] }
  ),


  new ElementStyle(
    'justifyContent',
    'flex-start',
    'X Align',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    { options: ['flex-start', 'center', 'flex-end', 'space-between'] }
  ),
  new ElementStyle(
    'alignItems',
    'flex-start',
    'Y Align',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    { options: ['flex-start', 'center', 'flex-end', 'space-between'] }
  ),

  new ElementStyle(
    'gap',
    '0px',
    'Gap',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,

    {
      units: elementStyleUnits,
      max: 1000
    }
  ),

  new ElementStyle(
    'margin',
    '',
    'Margin',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Margin
    }
  ),

  new ElementStyle(
    'marginLeft',
    '',
    'Left',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Margin
    }
  ),

  new ElementStyle(
    'marginTop',
    '',
    'Top',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Margin
    }
  ),

  new ElementStyle(
    'marginRight',
    '',
    'Right',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Margin
    }
  ),

  new ElementStyle(
    'marginBottom',
    '',
    'Bottom',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Margin
    }
  ),


  new ElementStyle(
    'padding',
    '',
    'Padding',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Padding
    }
  ),

  new ElementStyle(
    'paddingLeft',
    '',
    'Left',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Padding
    }
  ),

  new ElementStyle(
    'paddingTop',
    '',
    'Top',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Padding
    }
  ),
  new ElementStyle(
    'paddingRight',
    '',
    'Right',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Padding
    }
  ),

  new ElementStyle(
    'paddingBottom',
    '',
    'Bottom',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Padding
    }
  ),

  // Style
  new ElementStyle(
    'opacity',
    '100',
    'Opacity',
    ElementStyleType.Number,
    ElementStyleGroup.Style,
    {
      units: ['%'],
      max: 100
    }
  ),
  new ElementStyle(
    'overflow',
    'visible',
    'Overflow',
    ElementStyleType.Select,
    ElementStyleGroup.Style,
    { options: ['visible', 'hidden', 'scroll', 'auto'] }
  ),

  new ElementStyle(
    'backgroundColor',
    '',
    'Fill',
    ElementStyleType.Color,
    ElementStyleGroup.Style
  ),

  new ElementStyle(
    'border',
    '',
    'Border',
    ElementStyleType.Text,
    ElementStyleGroup.Style,
    {
      subGroup: ElementStyleSubGroup.Border
    }
  ),

  new ElementStyle(
    'borderColor',
    '',
    'Color',
    ElementStyleType.Color,
    ElementStyleGroup.Style,
    {
      subGroup: ElementStyleSubGroup.Border
    }
  ),

  new ElementStyle(
    'borderRadius',
    '',
    'Radius',
    ElementStyleType.Number,
    ElementStyleGroup.Style,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Border
    }
  ),

  new ElementStyle(
    'borderWidth',
    '',
    'Width',
    ElementStyleType.Number,
    ElementStyleGroup.Style,
    {
      units: elementStyleUnits,
      max: 1000,
      subGroup: ElementStyleSubGroup.Border
    }
  ),

  new ElementStyle(
    'boxShadow',
    '',
    'Shadow',
    ElementStyleType.Text,
    ElementStyleGroup.Style,
    {
      max: 1000,
      subGroup: ElementStyleSubGroup.Shadow
    }
  ),

  new ElementStyle(
    'shadowColor',
    '',
    'Color',
    ElementStyleType.Color,
    ElementStyleGroup.Style,
    {
      subGroup: ElementStyleSubGroup.Shadow
    }
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
    {
      units: elementStyleUnits,
      max: 1000
    }
  ),
  new ElementStyle(
    'fontWeight',
    'normal',
    'Weight',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    {
      options: [
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
    }
  ),
  new ElementStyle(
    'letterSpacing',
    '0px',
    'Letter',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    {
      units: elementStyleUnits,
      max: 100
    }
  ),
  new ElementStyle(
    'lineHeight',
    '100%',
    'Line Height',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    {
      units: ['%', 'px'],
      max: 1000
    }
  ),
  new ElementStyle(
    'textAlign',
    'start',
    'Align',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    {
      options: ['start', 'center', 'end']
    }
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

export function groupElementStylesByGroup(styles: ElementStyle[]): Record<string, ElementStyle[]> {
  return styles.reduce((groups: any, style) => {

    if (style.subGroup) {
      if (!groups[style.subGroup]) {
        groups[style.subGroup] = []
      }
      groups[style.subGroup].push(style)
      return sortGroupsByCustomOrder(groups)
    }


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