export default {
  async afterCreate(event) {
		console.log('⚡ Notification afterCreate ausgelöst:', event.result.title)
		if(event.result.publishedAt === null) return
		const notification = await strapi.db
		.query('api::notification.notification')
		.findOne({
			where: { documentId: event.result.documentId },
			populate: {
				workshop_groups: true
			}
		})
		console.log(notification)
		const workshopGroupIds = notification.workshop_groups.map((wg) => wg.documentId)
		let participations = []
		if(notification.title === 'Neuer Kommentar' ){
			participations = await strapi.db
			.query('api::participation.participation')
			.findMany({
				where: {
					publishedAt:{
						$ne: null
					},
					workshop_group: {
						documentId: {
							$in: workshopGroupIds
						}
					},
					notification: 'all'
				},
				populate: {
					user: true
				}
			})
		}
		console.log(participations)
		const userIds = participations
      .map((p) => (p as any).user?.id)
      .filter(Boolean)
		if (userIds.length === 0) {
			console.log('Keine Nutzer mit Notifications gefunden, breche ab.')
			return
		}
		console.log(userIds)
		await Promise.all(
			userIds.map((userId) =>
				strapi.service('api::user-notification.user-notification').create({
  data: {
    user: userId,
    notification: notification.id,
    is_read: false
  }
})
			)
		)
	}
}