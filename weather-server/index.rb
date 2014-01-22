#!/usr/bin/env ruby
# encoding: UTF-8
require 'rubygems' # for ruby 1.8
require 'sinatra'
require 'json'
require 'open-uri'
require 'nokogiri'
require 'date'
require 'time'
require 'redis'

set :bind, '0.0.0.0'

before do
  if request.request_method == 'OPTIONS'
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET"
    response.headers['Access-Control-Allow-Headers'] = 'origin, x-requested-with, accept'

    halt 200
  end
end

get '/:lat/:long/test' do
  start_date = Time.now.xmlschema
  end_date = (Time.now + (2*24*60*60)).xmlschema
  headers["Access-Control-Allow-Origin"] = "*"
  temp_forecast_url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=#{start_date}&end=#{end_date}&temp=temp"
  temp_forecast_url
end

get '/:lat/:long/forecast.json' do
  start_date = Time.now.xmlschema
  end_date = (Time.now + (2*24*60*60)).xmlschema
  headers["Access-Control-Allow-Origin"] = "*"
  temp_forecast_url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=#{start_date}&end=#{end_date}&temp=temp"
  doc = Nokogiri::XML(open(temp_forecast_url))
  location = doc.xpath('//data/location/point')
  lat = location.attribute("latitude").value
  long = location.attribute("longitude").value

  times = []

  doc.xpath('//data/time-layout').children.each do |time_element|
    if time_element.name == "start-valid-time"
      temp_time = DateTime.parse(time_element.children.first.to_s)
      times << temp_time.strftime("%Y-%m-%dT%H:%M:%S")
    end
  end

  temps = []
  i = 0
  doc.xpath('//data/parameters/temperature').children.each do |temp_element|
    if temp_element.name == "value"
      temps << [times[i], temp_element.children.first.to_s.to_i]
      i += 1
    end
  end

  json_data = temps.to_json

	content_type :json
  json_data
end

