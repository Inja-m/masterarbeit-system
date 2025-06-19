import { notDeepEqual } from "assert"

export default {
  async afterCreate(event) {	
		if(event.result.publishedAt === null) return
		if (event.result.createdAt !== event.result.updatedAt) return
		const message = await strapi.db
  .query('api::message.message')
  .findOne({
    where: { documentId: event.result.documentId },
    populate: {
      workshop: {populate: {
      workshop_groups: true
    }}
    }
  })
     // Notification anlegen
		  try {
 const not = await strapi.service('api::notification.notification').create({
  data: {
    title: 'Neuer Kommentar',
    message: message.message,
    workshop_groups: message.workshop.workshop_groups.map(g => g.id),
		documentId: message.documentId
  }
	
})
console.log(message.documentId, not.documentId)
} catch (err) {
      console.error('Fehler beim Erstellen der Notification:', err)
    }
		
  }
}