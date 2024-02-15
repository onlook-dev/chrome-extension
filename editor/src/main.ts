import App from './App.svelte';
import config from '../twind.config';
import 'construct-style-sheets-polyfill';
import { twind, cssom, observe } from '@twind/core';
import { ONLOOK_TOOLBAR } from './lib/constants';
class OnlookToolbar extends HTMLElement {
	constructor() {
		super();
		this.init();
	}

	connectedCallback() { }

	init() {
		this.style.position = 'fixed';
		this.style.zIndex = '2147483647';
		// Attaches a shadow DOM
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Add twind styles
		const sheet = cssom(new CSSStyleSheet());
		shadowRoot.adoptedStyleSheets = [sheet.target];
		observe(twind(config, sheet), shadowRoot);

		// Initialize Svelte app in the shadow root
		new App({
			target: shadowRoot
		});
	}
}

// Define the new element
customElements.define(ONLOOK_TOOLBAR, OnlookToolbar);
