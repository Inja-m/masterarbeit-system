import webPush from 'web-push'
import notification from '../../../notification/controllers/notification';

export default {
  async afterCreate(event) {
		console.log('⚡ User Notification afterCreate ausgelöst:', event.result);
		if(event.result.publishedAt === null) return

		const userNotification = await strapi.db
		.query('api::user-notification.user-notification')
		.findOne({
			where: { documentId: event.result.documentId },
			populate: {
				user: true,
				notification: true 
			}
		})
		console.log(userNotification)

		const subscriptions  = await strapi.db
		.query('api::subscription.subscription')
		.findMany({
			where: { user: userNotification.user.id },
			populate: {
				user: true,
				notification: true 
			}
		})
		console.log(subscriptions)
    if (subscriptions.length === 0) {
      console.log(
        'Keine Subscriptions gefunden, keine Push-Benachrichtigung versendet'
      )
      return
    }
    const payload = JSON.stringify({
      title: userNotification.notification.title || 'Neue Nachricht',
      body: userNotification.notification.message || '',
      icon: process.env.FRONTEND_URL + '/public/icons/icon_192x192.png'
    })

    webPush.setVapidDetails(
      'mailto:test@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const keys =
            typeof sub.keys === 'string' ? JSON.parse(sub.keys) : sub.keys
          console.log('Sending push to:', sub.endpoint)
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              expirationTime: sub.expirationTime || null,
              keys: {
                p256dh: keys.p256dh,
                auth: keys.auth
              }
            },
            payload
          )
          console.log('Push sent successfully')
        } catch (err) {
          console.error('Fehler beim Senden der Notification:', err)
        }
      })
    )

  }
}
