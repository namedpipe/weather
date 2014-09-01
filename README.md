weather
=======

This is a simplified weather app designed to show you the temperature and trends for your location. The goal is to have some clean to quickly assess the rate of temperature change.

![Weather web screen](/screenshot.png?raw=true "Weather web")

The app consists of three main parts:

## weather-server
This is a simple [Sinatra](http://www.sinatrarb.com/) app designed to retrieve and parse XML-formatted data from the NWS and send it in a nice JSON format.

## weather-web
This is a [AngularJS](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/), and [D3.js](http://d3js.org/) app designed to pull data from the weather-server and display a simple graph.

## weather-app
This is a [Cordova](http://cordova.apache.org/) (PhoneGap) app which wraps up the weather-web app to be used as an iOS app.
