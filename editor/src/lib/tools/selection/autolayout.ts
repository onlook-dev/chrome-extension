export enum LayoutProperty {
    width = 'width',
    height = 'height',
}

export enum LayoutMode {
    Fit = 'Fit',
    Fill = 'Fill',
    Relative = 'Relative',
    Fixed = 'Fixed',
}

export class AutoLayout {
    getInputValues(value: string): { mode: LayoutMode, value: string } {
        if (value === 'fit-content') return { mode: LayoutMode.Fit, value: value }
        if (value === '100%' || value === 'auto') return { mode: LayoutMode.Fill, value: "100%" }
        if (value.includes('%')) return { mode: LayoutMode.Relative, value: value }
        return { mode: LayoutMode.Fixed, value: value }
    }

    getRelativeValue(property: LayoutProperty, el: HTMLElement): string {
        if (!el.parentElement) return '100%'
        const parentVal = property === LayoutProperty.width ? el.parentElement.clientWidth : el.parentElement.clientHeight;
        const elVal = property === LayoutProperty.width ? el.clientWidth : el.clientHeight;
        return `${((elVal / parentVal) * 100).toFixed(0)}%`
    }

    getStyles(property: LayoutProperty, mode: LayoutMode, value: string, el: HTMLElement): Record<string, string> {
        let props = {};
        switch (mode) {
            case LayoutMode.Fit:
                props = {
                    displayVal: 'fit-content',
                    [property]: 'fit-content'
                }
                break;
            case LayoutMode.Fill:
                props = {
                    displayVal: '100%',
                    [property]: "100%"
                }
                break;
            case LayoutMode.Relative:
                const relativeValue = this.getRelativeValue(property, el)
                props = {
                    displayVal: relativeValue,
                    [property]: relativeValue
                }
                break;
            case LayoutMode.Fixed:
                const literalVal = `${property === LayoutProperty.width ? el.clientWidth : el.clientHeight}px`
                props = {
                    displayVal: literalVal,
                    [property]: literalVal
                }
                break;
            default:
                props = {
                    displayVal: value,
                    [property]: value
                }
                break;
        }
        return props
    }
}
