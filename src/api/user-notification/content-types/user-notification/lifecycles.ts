import webPush from 'web-push'

export default {
  async afterCreate(event) {
		if(event.result.publishedAt === null) return
    if (event.result.createdAt !== event.result.updatedAt) return

		const userNotification = await strapi.db
		.query('api::user-notification.user-notification')
		.findOne({
			where: { documentId: event.result.documentId },
			populate: {
				user: true,
				notification: true 
			}
		})

		const subscriptions  = await strapi.db
		.query('api::subscription.subscription')
		.findMany({
			where: { user: userNotification.user.id },
			populate: {
				user: true,
				notification: true 
			}
		})
    if (subscriptions.length === 0) return

    const payload = JSON.stringify({
      title: userNotification.notification.title || 'Neue Nachricht',
      body: userNotification.notification.message || '',
      icon: process.env.FRONTEND_URL + '/public/icons/icon_192x192.png',
			data: {
				url: `${process.env.FRONTEND_URL}/notifications` 
			}

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
        } catch (err) {
          console.error('Fehler beim Senden der Notification:', err)
        }
      })
    )
  }
}
