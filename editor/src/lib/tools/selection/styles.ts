import Color from 'colorjs.io'

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
  Layout = 'layout',
  Spacing = 'spacing',
  Text = 'text'
}

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

// Layout: backgroundColor position display direction width height borderRadius boxShadow
// Spacing: marign padding
// Text: fontFamily fontWeight color fontSize lineHeight letterSpacing textAlign textTransform textDecoration textShadow

export const elementStyles: ElementStyle[] = [
  // Layout
  new ElementStyle(
    'backgroundColor',
    'bga(0,0,0,0)',
    'Background',
    ElementStyleType.Color,
    ElementStyleGroup.Layout
  ),
  new ElementStyle(
    'position',
    'relative',
    'Position',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['relative', 'absolute', 'fixed', 'sticky', 'static']
  ),
  new ElementStyle(
    'display',
    'block',
    'Display',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['block', 'inline-block', 'inline', 'flex', 'grid', 'table', 'inherit', 'none']
  ),
  new ElementStyle(
    'direction',
    'ltr',
    'Direction',
    ElementStyleType.Select,
    ElementStyleGroup.Layout,
    ['ltr', 'rtl']
  ),
  new ElementStyle(
    'width',
    '100%',
    'Width',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'height',
    '100%',
    'Height',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    1000
  ),
  new ElementStyle(
    'borderRadius',
    '0px',
    'Radius',
    ElementStyleType.Number,
    ElementStyleGroup.Layout,
    [],
    elementStyleUnits,
    100
  ),
  new ElementStyle('boxShadow', 'none', 'Shadow', ElementStyleType.Text, ElementStyleGroup.Layout),

  // Spacing
  new ElementStyle(
    'margin',
    '0px 0px 0px 0px',
    'Margin',
    ElementStyleType.Text,
    ElementStyleGroup.Spacing
  ),
  new ElementStyle(
    'padding',
    '0px 0px 0px 0px',
    'Padding',
    ElementStyleType.Text,
    ElementStyleGroup.Spacing
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
    'lineHeight',
    '1.5',
    'Height',
    ElementStyleType.Number,
    ElementStyleGroup.Text,
    [],
    elementStyleUnits,
    100
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
    'textAlign',
    'left',
    'Alignment',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    ['left', 'center', 'right', 'justify', 'justify-all', 'match-parent']
  ),

  new ElementStyle(
    'textTransform',
    'none',
    'Capitalize',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    ['none', 'capitalize', 'uppercase', 'lowercase']
  ),
  new ElementStyle(
    'textDecoration',
    'none',
    'Decoration',
    ElementStyleType.Select,
    ElementStyleGroup.Text,
    ['none', 'underline', 'overline', 'line-through', 'blink']
  ),
  new ElementStyle('textShadow', 'none', 'Shadow', ElementStyleType.Text, ElementStyleGroup.Text)
]

export function groupElementStylesByGroup(elementStyles: ElementStyle[]): Record<string, ElementStyle[]> {
  return elementStyles.reduce((groups: any, style) => {
    // Initialize the group if it doesn't exist
    if (!groups[style.group]) {
      groups[style.group] = []
    }
    // Add the current style to the correct group
    groups[style.group].push(style)
    return groups
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
      style.value = (inlineStyle && inlineStyle !== '') ? inlineStyle : 'auto'
    } else if (style.type === ElementStyleType.Color) {
      style.value = inlineStyle && inlineStyle !== '' ? (new Color(inlineStyle)).toString({ format: 'hex' }) : ''
    } else {
      style.value = inlineStyle && inlineStyle !== '' ? inlineStyle : computedStyle
    }
  })

  return elementStyles
}