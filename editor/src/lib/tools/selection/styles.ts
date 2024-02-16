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
  Number = 'number',
  Select = 'select',
  Color = 'color'
}

export enum ElementStyleGroup {
  Size = 'Size',
  Position = 'Position',
  Style = 'Style',
  Text = 'Text',
  Spacing = 'Padding & Margin',
  Effects = 'Effects',
}

// Custom order for the groups
const groupOrder: ElementStyleGroup[] = [
  ElementStyleGroup.Size,
  ElementStyleGroup.Position,
  ElementStyleGroup.Style,
  ElementStyleGroup.Text,
  ElementStyleGroup.Spacing,
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
export const elementStyleUnits = ['px', '%', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax']

// Size: height, width, minHeight, minWidth, maxWidth, maxHeight, rotate, borderRadius
// Position: position
// Style: opacity, overflow, backgroundColor
// Text: fontFamily fontSize fontWeight color letterSpacing lineHeight textAlign 

// Layout: backgroundColor position display direction width height borderRadius boxShadow 
// Spacing: marign padding

export const elementStyles: ElementStyle[] = [
  // Size
  new ElementStyle(
    'width',
    '',
    'W',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'height',
    '',
    'H',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'minWidth',
    '',
    'mW',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'minHeight',
    '',
    'mH',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'maxWidth',
    '',
    'MW',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),

  new ElementStyle(
    'maxHeight',
    '',
    'MH',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'rotate',
    '',
    'Ro',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    ['deg', 'rad', 'grad', 'turn'],
    1000
  ),
  new ElementStyle(
    'borderRadius',
    '',
    'Rad',
    ElementStyleType.Number,
    ElementStyleGroup.Size,
    [],
    elementStyleUnits,
    1000
  ),

  // Position
  new ElementStyle(
    'position',
    'relative',
    'Type',
    ElementStyleType.Select,
    ElementStyleGroup.Position,
    ['relative', 'absolute', 'fixed', 'sticky', 'static']
  ),

  // Style
  new ElementStyle(
    'opacity',
    '1',
    'Opacity',
    ElementStyleType.Number,
    ElementStyleGroup.Style,
    [],
    [],
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
    'Background',
    ElementStyleType.Color,
    ElementStyleGroup.Style
  ),

  // Text
  new ElementStyle(
    'fontFamily',
    'sans-serif',
    'Font',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    [
      'system-ui',
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'emoji',
      'math',
      'fangsong'
    ]
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
    'color',
    'rgba(0,0,0,1)',
    'Color',
    ElementStyleType.Color,
    ElementStyleGroup.Text
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
    'Height',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    [],
    elementStyleUnits,
    100
  ),
  new ElementStyle(
    'textAlign',
    'left',
    'Alignment',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    ['left', 'center', 'right',]
  ),

  // Spacing
  new ElementStyle(
    'margin',
    '0px',
    'Margin',
    ElementStyleType.Text,
    ElementStyleGroup.Spacing
  ),
  new ElementStyle(
    'padding',
    '0px',
    'Padding',
    ElementStyleType.Text,
    ElementStyleGroup.Spacing
  ),

  // Effects
  new ElementStyle(
    'boxShadow',
    '',
    'Drop-shadow',
    ElementStyleType.Text,
    ElementStyleGroup.Effects
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

export function groupElementStylesByGroup(elementStyles: ElementStyle[]): Record<string, ElementStyle[]> {
  return elementStyles.reduce((groups: any, style) => {
    // Initialize the group if it doesn't exist
    if (!groups[style.group]) {
      groups[style.group] = []
    }
    // Add the current style to the correct group
    groups[style.group].push(style)
    return sortGroupsByCustomOrder(groups)
  }, {})
}

export function getElementComputedStylesData(target: HTMLElement) {
  // Retrieve all computed styles for the clicked element
  const computedStyles = getComputedStyle(target)
  // TODO: Could get styles based on tag types
  elementStyles.forEach((style: any) => {
    const inlineStyle = target.style[style.key]
    const computedStyle = computedStyles[style.key]
    if (style.type === ElementStyleType.Number) {
      style.value = (inlineStyle && inlineStyle !== '') ? inlineStyle : style.value
    } else if (style.type === ElementStyleType.Color) {
      style.value = inlineStyle && inlineStyle !== '' ? inlineStyle : computedStyle
    } else {
      style.value = inlineStyle && inlineStyle !== '' ? inlineStyle : computedStyle
    }
  })

  return elementStyles
}