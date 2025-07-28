export default {
  async afterCreate(event) {
		if(event.result.publishedAt === null) return
		const notification = await strapi.db
		.query('api::notification.notification')
		.findOne({
			where: { documentId: event.result.documentId },
			populate: {
				workshop_groups: true
			}
		})
		const workshopGroupIds = notification.workshop_groups.map((wg) => wg.documentId)
		let participations = await strapi.db
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
					 notification: {
						$ne: 'off'
					}
				},
				populate: {
					user: true
				}
			})
		if(notification.title === 'Neuer Kommentar' ){
			const relatedMessage = await strapi.db
			.query('api::message.message')
			.findOne({
				where: { documentId: notification.documentId },
				populate: { author: true },
			})
			const authorId = relatedMessage?.author?.id

					
			const where: any = {
				publishedAt: { $ne: null },
				workshop_group: {
					documentId: { $in: workshopGroupIds }
				},
				notification: 'all'
			};

			if (authorId) {
				where.user = {
					id: { $ne: authorId }
				};
			}

			participations = await strapi.db
				.query('api::participation.participation')
				.findMany({
					where,
					populate: {
						user: true
					}
				});
		}

		const userIds = participations
      .map((p) => (p as any).user?.id)
      .filter(Boolean)
		if (userIds.length === 0) return

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