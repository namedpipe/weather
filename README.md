weather
=======

This is a simplified weather app designed to show you the temperature and trends for your location. The goal is to have some clean to quickly assess the rate of temperature change.

![Weather web screen](screenshot.png?raw=true "Weather web")

## Why?
I know, do we really need another weather app?

Weather apps have become ever more complicated. They show you things about the sky (you can look outside to see if it's raining), they show you windchill or heat index, they show you maps, and so on and so on.

I focused on two needs and attempted to strip down to meen those needs (mostly geared around my need to run everyday):

1. What is the current temperature?
2. What will the temperature change to and how quickly?

From there I removed all the extras.

## Technical Details
The app consists of three main parts.

## weather-server
This is a simple [Sinatra](http://www.sinatrarb.com/) app designed to retrieve and parse XML-formatted data from the NWS and send it in a nice JSON format.

```
bundle install;
unicorn -c unicorn.rb -E production -D
```

The server will now be running on port 4567 and you can test it via something like https://127.0.0.1:4567/ZIPCODE/city.json - where ZIPCODE is a US ZIPCODE.

## weather-web
This is a [AngularJS](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/), and [D3.js](http://d3js.org/) app designed to pull data from the weather-server and display a simple graph.

The weather-server must be running for this front end to work. The best way to kick it off is using a local python-based HTTP server. Use the following:

```
cd weather-web/app;
python -mSimpleHTTPServer
```

Now visit http://localhost:8080/

## weather-app
This is a [Cordova](http://cordova.apache.org/) (PhoneGap) app which wraps up the weather-web app to be used as an iOS app. It requires Xcode to compile it. You should be able to open the project file located in weather-app/platforms/ios/.


Copyright 2013-2014 Mike Gorski. All rights reserved.