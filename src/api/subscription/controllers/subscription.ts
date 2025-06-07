import { factories } from '@strapi/strapi';
import webPush from 'web-push';

export default factories.createCoreController('api::subscription.subscription', ({ strapi }) => ({
  async subscribe(ctx) {
		console.log('Request body:', ctx.request.body)
    const { endpoint, expirationTime, keys } = ctx.request.body;

    // Optionale Authentifizierung
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to subscribe.');
    }

    // Prüfen, ob diese Subscription für den Benutzer bereits existiert
    const existing = await strapi.entityService.findMany('api::subscription.subscription', {
      filters: {
        endpoint,
        user: user.id,
      },
    });

    if (existing.length > 0) {
      return ctx.send({ success: true, message: 'Already subscribed' });
    }

    // Subscription speichern
    await strapi.entityService.create('api::subscription.subscription', {
      data: {
        endpoint,
        expirationTime,
        p256dh: keys?.p256dh,
        auth: keys?.auth,
        user: user.id,
      },
    });

    return ctx.send({ success: true, message: 'Subscription saved' });
  },

  async send(ctx) {
		console.log('called')
		const subscription = {
			endpoint: 'https://fcm.googleapis.com/fcm/send/eFFbz1jyZqQ:APA91bE8XDqgcepTJemJXxBjcl0Z7r914qy1CbVErx4DsQa-6L7PL26JJDvOf3YQLwPtyGogz-WPc1GWxp9hx1QctK6A7xFGpMkhqPTIObq2mrWY68FacFoDZYi6Iuo3y9cJF63107KN',
			expirationTime: null,
			keys: {
				p256dh: 'BCpZeM1hAG1L_-sbv6NxVXGmf_UUuDx6HasQHV4F17nvN7ZegPjKxLE9LgsyAGDb-IzY758SvwOL3a8EIQaruFs',
				auth: 'gMqluDZu-o4RXzaZW_z_aA'
			}
		};
		
    // VAPID konfigurieren
    webPush.setVapidDetails(
      'mailto:test@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
		await webPush.sendNotification(subscription, JSON.stringify({
			title: 'Testnachricht',
			body: 'Dies ist ein Test.',
		}));
    //const userId = ctx.state.user?.id;
    //if (!userId) {
    //  return ctx.unauthorized('No user');
    //}

    // Alle Subscriptions dieses Users laden
    //const subscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
    //  filters: { user: userId },
    //});

    //const payload = JSON.stringify({
    //  title: 'Neue Nachricht',
    //  body: 'Dies ist ein Test',
    //  icon: '/icon.png',
    //});

		//for (const sub of subscriptions) {
		//	try {
		//		const keys = typeof sub.keys === 'string' ? JSON.parse(sub.keys) : sub.keys;

		//		// keys als erwartete Struktur casten
		//		const pushKeys = keys as { p256dh?: string; auth?: string };

		//		await webPush.sendNotification(
		//			{
		//				endpoint: sub.endpoint,
		//				expirationTime: sub.expirationTime || null,
		//				keys: {
		//					p256dh: pushKeys.p256dh,
		//					auth: pushKeys.auth,
		//				},
		//			},
		//			JSON.stringify(payload)
		//		);
		//	} catch (err) {
		//		console.error('Fehler bei Push:', err);
		//	}
		//}

    ctx.send({ success: true });
  },
}));
