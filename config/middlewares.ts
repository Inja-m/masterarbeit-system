export default [
  'strapi::logger',
  'strapi::errors',
	{
		name: 'strapi::security',
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"connect-src": ["'self'", process.env.FRONTEND_URL], 
					"img-src": ["'self'", "data:", "blob:"],
					"media-src": ["'self'", "data:", "blob:"],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
  {
    name: 'strapi::cors',
    config: {
      origin: [process.env.FRONTEND_URL], // dein Frontend (kein / am Ende)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
