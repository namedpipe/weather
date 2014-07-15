App.Router.map(function() {
  this.resource('forecast', { path: '/' });
});

App.ForecastRoute = Ember.Route.extend({
  setupController: function(controller, location) {
    controller.set('model', location);
  }
});
