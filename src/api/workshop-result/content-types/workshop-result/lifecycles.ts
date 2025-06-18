import evaluationStep from "../../../evaluation-step/controllers/evaluation-step";

export default {
	 async beforeUpdate(event) {
		console.log('before', event)
    const id = event.params.where.id;

    // Hole alten Zustand
    const previous = await strapi.db.query('api::workshop-result.workshop-result').findOne({
      where: { id },
    });

    const nextStatus = event.params.data.evaluationStatus;
    const prevStatus = previous.evaluationStatus;
console.log(nextStatus,prevStatus)
    const statusChanged =
      nextStatus !== prevStatus && ['inProgress', 'done'].includes(nextStatus);

    if (statusChanged) {
      // Optional: flag in `event.state` setzen für afterUpdate
      event.state = { triggerNotification: true };
    }
  }, async afterUpdate(event) {
		console.log(event.state?.triggerNotification)
    if (event.state?.triggerNotification) {

     await maybeTriggerNotification(event.result)

      console.log('📩 Notification ausgelöst nach Statusänderung');
    }
  },
  async afterCreate(event) {
		if (event.result.createdAt !== event.result.updatedAt) return
		if(event.result.publishedAt === null) return
		console.log('after create', event)
    await maybeTriggerNotification(event.result);
    
  }
	}

async function maybeTriggerNotification(result) {
	console.log('funktion', result )
  const status = result.evaluationStatus;
  if ('todo' === status) return;

  const workshopResult = await strapi.db
    .query('api::workshop-result.workshop-result')
    .findOne({
      where: { id: result.id },
      populate: {
        evaluation_step: true,
        workshop: {
          populate: {
            workshop_groups: true,
            workshop_serie: true
          },
        }
      }
    });
console.log('workshop Result:',workshopResult)
  const message = `${workshopResult.evaluation_step.name} ist jetzt "${status}" für "${workshopResult.workshop.workshop_serie.name}".`;

	const res = await strapi.service('api::notification.notification').create({
  data: {
    title: 'Neuer Status im Workshop-Ergebnis',
    message: message,
    workshop_groups: workshopResult.workshop.workshop_groups.map(g => g.id)
  }
  });

  console.log('🔔 Notification erstellt für Workshop-Ergebnis-Status:', res);
}