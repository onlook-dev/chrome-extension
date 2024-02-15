import App from './App.svelte';
import config from '../twind.config';
import 'construct-style-sheets-polyfill';
import { twind, cssom, observe } from '@twind/core';

document.addEventListener('DOMContentLoaded', () => {
	const element = document.createElement('div');
	element.classList.add('dark');
	element.style.position = 'fixed';
	element.style.zIndex = '2147483647';
	document.body.appendChild(element);

	// Attaches a shadow dom
	const shadowRoot = element.attachShadow({ mode: 'open' });

	// Add twind styles
	const sheet = cssom(new CSSStyleSheet());
	// element.styleSheets = [sheet.target];
	shadowRoot.adoptedStyleSheets = [sheet.target];
	observe(twind(config, sheet), shadowRoot);

	// Initialize Svelte app in the shadow root
	new App({
		target: shadowRoot
	});
});
