interface Rect {
    element: HTMLElement;
    svgNamespace: string;
    svgElement: Element;
    rectElement: Element;
    render: (rect: { width: number, height: number, top: number, left: number }) => void;
}

export class HoverRect implements Rect {
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
        this.rectElement.setAttribute('stroke', '#FF0000') // Blue outline
        this.rectElement.setAttribute('stroke-width', '2')
        this.svgElement.appendChild(this.rectElement)
        this.element.style.position = 'absolute'
        this.element.style.pointerEvents = 'none' // Ensure it doesn't interfere with other interactions
        this.element.style.zIndex = '999'
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

class ClickRect implements Rect {
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
        this.rectElement.setAttribute('stroke', '#FF0000')
        this.rectElement.setAttribute('stroke-width', '4')
        this.rectElement.setAttribute('stroke-linecap', 'round')
        this.rectElement.setAttribute('stroke-linejoin', 'round')
        this.svgElement.appendChild(this.rectElement)
        this.element.style.position = 'absolute'
        this.element.style.pointerEvents = 'none'
        this.element.style.zIndex = '999'
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

export class ParentRect implements Rect {
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
        this.rectElement.setAttribute('stroke', '#FF0000')
        this.rectElement.setAttribute('stroke-width', '1')
        this.rectElement.setAttribute('stroke-dasharray', '5')
        this.svgElement.appendChild(this.rectElement)
        this.element.style.position = 'absolute'
        this.element.style.pointerEvents = 'none'
        this.element.style.zIndex = '999'
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

let hoverRect: HoverRect = new HoverRect()
let clickRect: ClickRect = new ClickRect()
let parentRect: ParentRect = new ParentRect()

document.body.appendChild(hoverRect.element)
document.body.appendChild(clickRect.element)
document.body.appendChild(parentRect.element)

export function updateHoverRect(element: Element) {
    if (hoverRect) {
        const rect = element.getBoundingClientRect()
        hoverRect.render(rect)
    }
}

export function updateClickRect(element: Element) {
    if (clickRect) {
        const rect = element.getBoundingClientRect()
        clickRect.render(rect)
    }
    if (parentRect) {
        const rect = element.parentElement.getBoundingClientRect()
        parentRect.render(rect)
    }
    removeHoverRect()
}

export function removeHoverRect() {
    if (hoverRect) {
        hoverRect.render({ width: 0, height: 0, top: 0, left: 0 })
    }
}

export function removeClickedRect() {
    if (clickRect) {
        clickRect.render({ width: 0, height: 0, top: 0, left: 0 })
    }
}