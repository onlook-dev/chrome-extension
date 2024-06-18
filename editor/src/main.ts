import App from './App.svelte';
import config from '../twind.config';
import 'construct-style-sheets-polyfill';
import { twind, cssom, observe } from '@twind/core';
import { ONLOOK_GLOBAL_STYLES, ONLOOK_TOOLBAR } from '$shared/constants';
import { DATA_ONLOOK_EJECT, DATA_ONLOOK_IGNORE, DATA_ONLOOK_INJECT, DATA_ONLOOK_SAVED, ONLOOK_EDITABLE, } from '$/lib/constants';

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
		const shadowRoot = this.attachShadow({ mode: 'closed' });

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
		return [DATA_ONLOOK_EJECT, DATA_ONLOOK_INJECT, DATA_ONLOOK_SAVED,];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.app.handleValueUpdate(name, oldValue, newValue);
	}

	connectedCallback() {
		this.setAttribute('popover', 'manual')
		this.showPopover && this.showPopover();
		// Inject global styles
		this.injectGlobalStyles();
	}

	disconnectedCallback() {
		this.hidePopover && this.hidePopover();
		// Remove global styles
		this.removeGlobalStyles();
	}

	injectGlobalStyles() {
		const style = document.createElement('style');
		style.id = ONLOOK_GLOBAL_STYLES
		style.textContent = ``;
		document.head.appendChild(style);
	}

	removeGlobalStyles() {
		const style = document.getElementById(ONLOOK_GLOBAL_STYLES);
		style && style.remove();
	}

}

// Define the new element
customElements.define(ONLOOK_TOOLBAR, OnlookToolbar);
