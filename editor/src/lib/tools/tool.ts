export interface Tool {
    onInit(): void;
    onDestroy(): void;
    onMouseOver(el: Element): void;
    onMouseOut(el: Element): void;
    onClick(el: Element): void;
}
