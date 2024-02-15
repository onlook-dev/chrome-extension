import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from '../package.json'

const { version, name, description } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
	// can only contain digits, dots, or dash
	.replace(/[^\d.-]+/g, '')
	// split into version parts
	.split(/[.-]/)

export default defineManifest(async env => ({
	manifest_version: 3,
	name: name,
	description: description,
	version: `${major}.${minor}.${patch}`,
	version_name: version,
	icons: {
		'16': 'src/assets/icons/icon16.png',
		'32': 'src/assets/icons/icon32.png',
		'48': 'src/assets/icons/icon48.png',
		'128': 'src/assets/icons/icon128.png'
	},
	content_scripts: [
		{
			matches: ['<all_urls>'],
			js: ['src/extension/content/index.ts'],
			run_at: 'document_idle'
		}
	],
	background: {
		service_worker: 'src/extension/background/index.ts',
		persistent: true,
		type: 'module'
	},
	action: {
		default_popup: 'src/extension/popup/popup.html',
		default_icon: {
			'16': 'src/assets/icons/icon16.png',
			'32': 'src/assets/icons/icon32.png',
			'48': 'src/assets/icons/icon48.png',
			'128': 'src/assets/icons/icon128.png'
		}
	},
	web_accessible_resources: [
		{
			resources: ['src/lib/visbug/tuts/*.gif', 'src/lib/visbug/toolbar/*'],
			matches: ['<all_urls>']
		}
	],
	commands: {
		_execute_browser_action: {
			suggested_key: {
				windows: 'Alt+Shift+D',
				mac: 'Alt+Shift+D',
				chromeos: 'Alt+Shift+D',
				linux: 'Alt+Shift+D'
			}
		}
	},
	key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0ZbbiZr79FXRJD9Z+jGZsskQstsnkpMHy2yh0HO/udWPFWx/RMjztm/5WQ5p1rIKdBPPZ+xx0WmBZte8OGJ+Ls8MWXo9oUIsKFfxeD8eFNEpaFNKZ6hCvck761/ZXaMN4kCsnwzadR6dTcEoyuPgdUjsrMzDOdCgBgornITel+YfgML6rJb0dBjoTiI1SHGXt5jhO18hjFI9knNtTt2zrQK773YV3fWFKkqCWwWSSlmc0vsivKVgSAie6olRNmV4UyfO7iosFDyA2Q4UoTgMovrwy233OXPi2H24VVXqRYF8wNn1VnakoQWdp+n8zcju+iyPdvjM1w40uv8Hvxnb9wIDAQAB',
	host_permissions: ['<all_urls>'],
	permissions: [
		'tabs',
		'storage',
		'activeTab',
		'contextMenus',
		'scripting'
	] as chrome.runtime.ManifestPermissions[]
}))
