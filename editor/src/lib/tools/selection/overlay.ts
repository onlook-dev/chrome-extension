import { DATA_ONLOOK_IGNORE, ONLOOK_RECT_ID } from "$lib/constants";

interface Rect {
    element: HTMLElement;
    svgNamespace: string;
    svgElement: Element;
    rectElement: Element;
    render: (rect: { width: number, height: number, top: number, left: number }) => void;
}

class RectImpl implements Rect {
    element: HTMLElement;
    svgNamespace: string;
    svgElement: Element;
    rectElement: Element;

    constructor() {
        this.element = document.createElement('div')
        this.svgNamespace = 'http://www.w3.org/2000/svg'
        this.svgElement = document.createElementNS(this.svgNamespace, 'svg')
        this.svgElement.setAttribute('overflow', 'visible')
        this.rectElement = document.createElementNS(this.svgNamespace, 'rect')
        this.rectElement.setAttribute('fill', 'none')
        this.rectElement.setAttribute('stroke', '#FF0E48')
        this.rectElement.setAttribute('stroke-width', '2')
        this.rectElement.setAttribute('stroke-linecap', 'round')
        this.rectElement.setAttribute('stroke-linejoin', 'round')
        this.svgElement.appendChild(this.rectElement)
        this.element.style.position = 'absolute'
        this.element.style.pointerEvents = 'none' // Ensure it doesn't interfere with other interactions
        this.element.style.zIndex = '999'
        this.element.setAttribute(DATA_ONLOOK_IGNORE, 'true');
        this.element.setAttribute('id', ONLOOK_RECT_ID)
        this.element.appendChild(this.svgElement)
    }

    render({ width, height, top, left }) {
        this.svgElement.setAttribute('width', width)
        this.svgElement.setAttribute('height', height)
        this.svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
        this.rectElement.setAttribute('width', width)
        this.rectElement.setAttribute('height', height)
        this.element.style.top = `${top + window.scrollY}px`
        this.element.style.left = `${left + window.scrollX}px`
    }
}

class HoverRect extends RectImpl {

    constructor() {
        super()
        this.rectElement.setAttribute('stroke-width', '2')
    }

    render({ width, height, top, left }) {
        super.render({ width, height, top, left })
    }
}

class ClickRect extends RectImpl {

    constructor() {
        super()
        this.rectElement.setAttribute('stroke-width', '4')
    }

    parseCssBoxValues(boxValue) {
        const values = boxValue.split(' ').map(parseFloat);
        if (values.length === 1) {
            return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
        } else if (values.length === 2) {
            return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
        } else if (values.length === 3) {
            return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
        } else {
            return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
        }
    }

    updateMargin(margin, { width, height, top, left }) {
        const { top: mTop, right: mRight, bottom: mBottom, left: mLeft } = this.parseCssBoxValues(margin);
        // Adjust position and size based on margins
        const mWidth = width + mLeft + mRight;
        const mHeight = height + mTop + mBottom;
        const mX = -mLeft;
        const mY = -mTop;

        // Create and style the margin rectangle
        const marginRect = document.createElementNS(this.svgNamespace, 'rect');
        marginRect.setAttribute('x', mX.toString());
        marginRect.setAttribute('y', mY.toString());
        marginRect.setAttribute('width', mWidth.toString());
        marginRect.setAttribute('height', mHeight.toString());
        marginRect.setAttribute('fill', 'rgba(255, 165, 0, 0.2)'); // Orange, semi-transparent
        marginRect.setAttribute('stroke', 'none');

        this.svgElement.insertBefore(marginRect, this.svgElement.firstChild); // Ensure it's under the element rectangle
        console.log('margin rect', marginRect)
    }

    updatePadding(padding, { width, height, top, left }) {
        const { top: pTop, right: pRight, bottom: pBottom, left: pLeft } = this.parseCssBoxValues(padding);
        // Adjust position and size based on paddings
        const pWidth = width - pLeft - pRight;
        const pHeight = height - pTop - pBottom;
        const pX = pLeft;
        const pY = pTop;

        // Create and style the padding rectangle
        const paddingRect = document.createElementNS(this.svgNamespace, 'rect');
        paddingRect.setAttribute('x', pX.toString());
        paddingRect.setAttribute('y', pY.toString());
        paddingRect.setAttribute('width', pWidth.toString());
        paddingRect.setAttribute('height', pHeight.toString());
        paddingRect.setAttribute('fill', 'rgba(0, 0, 255, 0.2)'); // Blue, semi-transparent
        paddingRect.setAttribute('stroke', 'none');

        this.svgElement.insertBefore(paddingRect, this.rectElement.nextSibling); // Ensure it's between the margin and the element rectangles
        console.log('padding rect', paddingRect)
    }

    render({ width, height, top, left, margin, padding }) {
        this.updateMargin(margin, { width, height, top, left });
        this.updatePadding(padding, { width, height, top, left });

        // Render the base rect (the element itself) on top
        super.render({ width, height, top, left });
    }
}

class ParentRect extends RectImpl {

    constructor() {
        super()
        this.rectElement.setAttribute('stroke-width', '2')
        this.rectElement.setAttribute('stroke-dasharray', '5')
    }

    render({ width, height, top, left }) {
        super.render({ width, height, top, left })
    }
}

export class OverlayManager {
    hoverRect: HoverRect
    clickedRects: ClickRect[]
    parentRect: ParentRect

    constructor() {
        this.hoverRect = new HoverRect();
        this.clickedRects = [];
        this.parentRect = new ParentRect();

        document.body.appendChild(this.hoverRect.element)
        document.body.appendChild(this.parentRect.element)
    }

    clear = () => {
        this.removeParentRect()
        this.removeHoverRect()
        this.removeClickedRects()
    }

    addClickRect = (el: HTMLElement) => {
        if (!el) return
        const clickRect = new ClickRect()
        this.clickedRects.push(clickRect)
        const rect = el.getBoundingClientRect()
        const margin = window.getComputedStyle(el).margin
        const padding = window.getComputedStyle(el).padding
        clickRect.render({ width: rect.width, height: rect.height, top: rect.top, left: rect.left, padding, margin });
        document.body.appendChild(clickRect.element)
    }

    updateParentRect = (el: HTMLElement) => {
        if (!el || !this.parentRect) return
        const rect = el.getBoundingClientRect()
        this.parentRect.render(rect)
    }

    updateHoverRect = (el: HTMLElement) => {
        if (!el || !this.hoverRect) return
        const rect = el.getBoundingClientRect()
        this.hoverRect.render(rect)

    }

    removeHoverRect = () => {
        this.hoverRect.render({ width: 0, height: 0, top: 0, left: 0 })
    }

    removeClickedRects = () => {
        this.clickedRects.forEach(clickRect => {
            clickRect.element.remove()
        })
        this.clickedRects = []
    }

    removeParentRect = () => {
        this.parentRect.render({ width: 0, height: 0, top: 0, left: 0 })
    }
}