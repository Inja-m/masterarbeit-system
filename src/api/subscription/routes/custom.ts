export default {
  routes: [
    {
      method: 'POST',
      path: '/subscribe',
      handler: 'subscription.subscribe',
      config: {
        policies: [],
      }
    },
    {
      method: 'POST',
      path: '/send',
      handler: 'subscription.send',
      config: {
        policies: [],
      }
    },
  ],
};