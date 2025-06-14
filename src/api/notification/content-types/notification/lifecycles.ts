import webPush from 'web-push'

export default {
  async afterCreate(event) {
		console.log('⚡ Notification afterCreate ausgelöst:', event.result.publishedAt);
		if(event.result.publishedAt === null) return

    const { result } = event

    // Vollständig laden mit workshop_groups
    const notificationWithGroups = (await strapi.entityService.findOne(
      'api::notification.notification',
      result.id,
      {
        populate: {
          workshop_groups: true
        }
      }
    )) as typeof notificationWithGroups & { workshop_groups: Array<any> }

    const workshopGroups = notificationWithGroups.workshop_groups || []
    if (workshopGroups.length === 0) {
      console.log('Keine Workshop Groups gefunden, breche ab.')
      return
    }

    const workshopGroupIds = workshopGroups.map((wg) => wg.documentId)
    const participations = await strapi.entityService.findMany(
      'api::participation.participation',
      {
        filters: {
          workshop_group: {
            documentId: {
        $in: workshopGroupIds,
      },
    },
    notification: {
      $ne: 'off',
          },
        },
        populate: ['user']
      } as any
    )

    const userIds = participations
      .map((p) => (p as any).user?.id)
      .filter(Boolean)
    if (userIds.length === 0) {
      console.log('Keine Nutzer mit Notifications gefunden, breche ab.')
      return
    }
    const subscriptions = await strapi.entityService.findMany(
      'api::subscription.subscription',
      {
        filters: {
          user: { id: { $in: userIds } }
        }
      }
    )
    if (subscriptions.length === 0) {
      console.log(
        'Keine Subscriptions gefunden, keine Push-Benachrichtigung versendet'
      )
      return
    }
    const payload = JSON.stringify({
      title: result.title || 'Neue Nachricht',
      body: result.message || '',
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
		await Promise.all(
      userIds.map((userId) =>
        strapi.entityService.create(
          'api::user-notification.user-notification',
          {
            data: {
              user: userId,
              notification: result.documentId,
              is_read: false
            }
          }
        )
      )
    )
  }
}
