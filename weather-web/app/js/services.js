'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var servicesModule = angular.module('weatherApp.services', []);

servicesModule.value('version', '1.0');
servicesModule.value('city', 'Des Moines');
servicesModule.value('lat', '41.58');
servicesModule.value('lon', '-93.62');
servicesModule.value('server', 'http://localhost:4567');
