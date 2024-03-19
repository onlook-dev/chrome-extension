import App from './App.svelte';
import config from '../twind.config';
import 'construct-style-sheets-polyfill';
import { twind, cssom, observe } from '@twind/core';
import { DATA_ONLOOK_EJECT, DATA_ONLOOK_IGNORE, DATA_ONLOOK_INJECT, ONLOOK_EDITABLE, ONLOOK_TOOLBAR } from './lib/constants';

class OnlookToolbar extends HTMLElement {
	app: any;
	constructor() {
		super();
		this.style.position = 'fixed';
		this.style.zIndex = '2147483647';
		this.style.backgroundColor = 'transparent';
		this.style.pointerEvents = 'none';
		this.style.width = '100%';
		this.style.height = '100%';
		this.popover = 'manual';

		this.setAttribute(DATA_ONLOOK_IGNORE, 'true');

		// Attaches a shadow DOM
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Add twind styles
		const sheet = cssom(new CSSStyleSheet());
		shadowRoot.adoptedStyleSheets = [sheet.target];
		observe(twind(config, sheet), shadowRoot);

		// Initialize Svelte app in the shadow root
		this.app = new App({
			target: shadowRoot
		});
	}

	static get observedAttributes() {
		return [DATA_ONLOOK_EJECT, DATA_ONLOOK_INJECT];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.app.handleValueUpdate(name, oldValue, newValue);
	}

	connectedCallback() {
		this.togglePopover(true);
	}
}

function injectGlobalStyles() {
	const style = document.createElement('style');
	style.textContent = `
						${ONLOOK_TOOLBAR}::backdrop {
                outline: 2px solid #00ff94;
            }
            .${ONLOOK_EDITABLE} {
                outline: 2px solid #00ff94;
            }
        `;
	document.head.appendChild(style);
}

// Define the new element
customElements.define(ONLOOK_TOOLBAR, OnlookToolbar);

// Inject global styles
injectGlobalStyles();
