export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.RT7IK-K-.js","app":"_app/immutable/entry/app.4XSvLd9M.js","imports":["_app/immutable/entry/start.RT7IK-K-.js","_app/immutable/chunks/scheduler.2JpnNXgI.js","_app/immutable/chunks/singletons.1FhH5g0R.js","_app/immutable/chunks/index.CClw3PgW.js","_app/immutable/entry/app.4XSvLd9M.js","_app/immutable/chunks/preload-helper.0HuHagjb.js","_app/immutable/chunks/scheduler.2JpnNXgI.js","_app/immutable/chunks/index.miTbgV9r.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/callback/github",
				pattern: /^\/callback\/github\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/dashboard/projects/[id]",
				pattern: /^\/dashboard\/projects\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/payment",
				pattern: /^\/payment\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/payment/_server.ts.js'))
			},
			{
				id: "/payment/webhooks",
				pattern: /^\/payment\/webhooks\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/payment/webhooks/_server.ts.js'))
			},
			{
				id: "/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/signin",
				pattern: /^\/signin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
