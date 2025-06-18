export default {
  async afterCreate(event) {	
		console.log(event)
		if(event.result.publishedAt === null) return
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
    console.log(message.workshop.workshop_groups)

     // Notification anlegen
		  try {
  await strapi.service('api::notification.notification').create({
  data: {
    title: 'Neuer Kommentar',
    message: message.message,
    workshop_groups: message.workshop.workshop_groups.map(g => g.id)
  }
	
})
} catch (err) {
      console.error('Fehler beim Erstellen der Notification:', err)
    }
    console.log('Notification erstellt')
  }
}