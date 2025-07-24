
export default ({ env }) => ({
  // ...
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '30d',
      },
    },
  },
	email: {
    config: {
      provider: 'nodemailer',
			providerOptions:{
				host: env('SMTP_HOST'),
				port:env.int('SMTP_PORT'),
				secure: true,
				auth:{
					user: env('SMTP_USERNAME'),
					pass: env('SMTP_PASSWORD')
				}
			},
      settings: {
        defaultFrom: env('SMTP_USERNAME'),
        defaultReplyTo: env('SMTP_USERNAME')
      },
    },
  },
  // ...
});