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
		'16': 'src/assets/icons/icon-16.png',
		'32': 'src/assets/icons/icon-32.png',
		'48': 'src/assets/icons/icon-48.png',
		'128': 'src/assets/icons/icon-128.png'
	},
	content_scripts: [
		{
			matches: ['https://*/*', 'http://*/*'],
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
			'16': 'src/assets/icons/icon-active-16.png',
			'32': 'src/assets/icons/icon-active-32.png',
			'48': 'src/assets/icons/icon-active-48.png',
			'128': 'src/assets/icons/icon-active-128.png'
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
	key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv18eK1MhBgVx6W0HGq+OtRHZQl9AiiAcddgTqfXUSFw8XSVCCvfvlbUk4zccEmk/FIXHYiE4Zq31RqMwzJXSdM49jAvQgqRftAvSfSZ25qrmfAicQmotN48fKu7C50zLMNytyYZtVVpdZJTfmONVTtbQ+N3g3XregUlbrjb9ywH/UsP4wdw5iWqyYigpJM3BjU2u304c3tkxJjb5pdbtCdT1O6oYLfuTNLzcnRVVQOdb2/LwGLac6ZgNof5xkNrmdldAU/a5Q+2pfgv4f5VaR9Qny/cJIgj+f3nzn2OqtRVWp3ujBDfxZWFCtdKio66ADRgJ3m/UushMo1LThtnRcQIDAQAB',
	host_permissions: ['<all_urls>'],
	permissions: [
		'storage',
		'activeTab',
		'contextMenus',
		'scripting'
	] as chrome.runtime.ManifestPermissions[]
}))
