import { factories } from '@strapi/strapi';
import webPush from 'web-push';

export default factories.createCoreController('api::subscription.subscription', ({ strapi }) => ({
  async subscribe(ctx) {

    const { endpoint, expirationTime, keys } = ctx.request.body;
    const user = ctx.state.user;

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
				keys:keys,
        user: user.id,
      },
    });

    return ctx.send({ success: true, message: 'Subscription saved' });
  },

  async send(ctx) {
		const user = ctx.state.user;
  if (!user) {
    return ctx.unauthorized('User not authenticated');
  }

  const { title, body, url } = ctx.request.body;

  const payload = JSON.stringify({
    title: title || 'Push Nachricht',
    body: body || 'Dies ist eine Benachrichtigung',
    data: { url: url || '/' },
  });

  const subscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
    filters: { user: user.id },
  });

  webPush.setVapidDetails(
    'mailto:test@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const keys = typeof sub.keys === 'string' ? JSON.parse(sub.keys) : sub.keys;
      return webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          expirationTime: sub.expirationTime || null,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
        },
        payload
      );
    })
  );

  ctx.send({ success: true, results });
  },
}));
