enum LayoutProperty {
    Width = 'width',
    Height = 'height',
}

enum LayoutMode {
    FitContent = 'Fit Content',
    Fill = 'Fill',
    Relative = 'Relative',
    Fixed = 'Fixed',
}

class AutoLayout {
    getInputValues(value: string): { mode: LayoutMode, value: string } {
        return { mode: LayoutMode.Fixed, value: value }
    }

    getStyles(property: LayoutProperty, value: string, mode: LayoutMode): Record<string, string> {
        let props = {};
        switch (mode) {
            case LayoutMode.FitContent:
                props = {
                    [property]: 'fit-content'
                }
                break;
            case LayoutMode.Fill:
                props = {
                    [property]: value
                }
                break;
            case LayoutMode.Relative:
                props = {
                    [property]: value
                }
                break;
            case LayoutMode.Fixed:
                props = {
                    [property]: value
                }
                break;
            default:
                break;
        }
        return {}
    }
}
