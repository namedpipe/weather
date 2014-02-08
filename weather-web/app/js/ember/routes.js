Weather.WeatherRoute = Ember.Route.extend({
  setupController: function(controller, location) {
    controller.set('model', location);
  }
});