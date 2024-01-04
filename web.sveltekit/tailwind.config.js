/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				chalk: {
					primary: '#111827',
					'primary-content': '#ffffff',
					neutral: '#ebeef5',
					'neutral-content': '#303133',
					accent: '#a8abb2',
					'accent-content': '#ffffff',
					secondary: '#303133',
					'secondary-content': '#ffffff',
					info: '#909399',
					'info-content': '#ffffff',
					success: '#67c23a',
					'success-content': '#ffffff',
					warning: '#e6a23c',
					'warning-content': '#ffffff',
					error: '#f56c6c',
					'error-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f9fafb',
					'base-300': '#dfe4e8',
					'base-content': '#1f2937'
				}
			}
		]
	}
};
