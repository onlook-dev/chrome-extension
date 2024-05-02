import App from './App.svelte';
import config from '../twind.config';
import 'construct-style-sheets-polyfill';
import { twind, cssom, observe } from '@twind/core';
import { ONLOOK_TOOLBAR } from '$shared/constants';
import { DATA_ONLOOK_EJECT, DATA_ONLOOK_HOVER, DATA_ONLOOK_IGNORE, DATA_ONLOOK_INJECT, DATA_ONLOOK_SAVED, ONLOOK_EDITABLE } from '$/lib/constants';

class OnlookToolbar extends HTMLElement {
	app: any;

	constructor() {
		super();
		this.style.position = 'fixed';
		this.style.zIndex = '9999';
		this.style.backgroundColor = 'transparent'
		this.style.border = 'none'
		this.style.overflow = 'visible'
		this.style.inset = '0 auto auto 0'
		this.style.width = '0'
		this.style.height = '0'
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
		return [DATA_ONLOOK_EJECT, DATA_ONLOOK_INJECT, DATA_ONLOOK_SAVED];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.app.handleValueUpdate(name, oldValue, newValue);
	}

	connectedCallback() {
		this.setAttribute('popover', 'manual')
		this.showPopover && this.showPopover();
	}

	disconnectedCallback() {
		this.hidePopover && this.hidePopover();
	}
}

function injectGlobalStyles() {
	const style = document.createElement('style');
	style.textContent = `
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
