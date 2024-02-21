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

    render({ width, height, top, left }) {
        super.render({ width, height, top, left })
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
        const clickRect = new ClickRect()
        this.clickedRects.push(clickRect)
        const rect = el.getBoundingClientRect()
        clickRect.render(rect)
        document.body.appendChild(clickRect.element)
    }

    updateParentRect = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect()
        this.parentRect.render(rect)
    }

    updateHoverRect = (el: HTMLElement) => {
        if (el && this.hoverRect) {
            const rect = el.getBoundingClientRect()
            this.hoverRect.render(rect)
        }
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