import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export function draggable(node: HTMLElement) {
  let offsetX = 0, offsetY = 0;
  let initialMouseX = 0, initialMouseY = 0;
  let initialElemX = 0, initialElemY = 0;
  
  function onMouseMove(event: MouseEvent) {
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;

    let newTop = initialElemY + deltaY;
    let newLeft = initialElemX + deltaX;

    // Constrain within the viewport
    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;

    if (newTop < minY) newTop = minY;
    if (newTop > maxY) newTop = maxY;
    if (newLeft < minX) newLeft = minX;
    if (newLeft > maxX) newLeft = maxX;

    node.style.top = newTop + "px";
    node.style.left = newLeft + "px";
  }

  function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }

  function onMouseDown(event: MouseEvent) {
    // Ensure the target is within the handle
    if (!(event.target as HTMLElement).closest('[data-drag-handle]')) {
      return;
    }

    event.preventDefault();
    
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    initialElemX = node.offsetLeft;
    initialElemY = node.offsetTop;
    
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  node.addEventListener("mousedown", onMouseDown);

  return {
    destroy() {
      node.removeEventListener("mousedown", onMouseDown);
    }
  };
}
