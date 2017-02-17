#!/usr/bin/env ruby
# encoding: UTF-8

require 'open-uri'
require 'date'
require 'time'
require 'timezone'

set :bind, '0.0.0.0'

class WeatherApp < Sinatra::Base
  NWS_ENDPOINT = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php"
  NWS_STATION_LIST = "http://w1.weather.gov/xml/current_obs/index.xml"
  NWS_CURRENT_OBSERVATION = "http://w1.weather.gov/xml/current_obs/"

  doc = Nokogiri::XML(open(NWS_STATION_LIST))
  points = []
  stations = []
  doc.xpath('//wx_station_index/station').each do |station|
    station_id = station.xpath('station_id').first.content
    stations << station_id
    latitude = station.xpath('latitude').first.content
    longitude = station.xpath('longitude').first.content
    point = [latitude.to_f, longitude.to_f, stations.index(station_id)]
    points << point
  end
  # A k-d tree for storing the data of weather stations and latitude/longitude
  # allows for searching to find the nearest point
  kd = Kdtree.new(points)
  set :kd, kd
  set :stations, stations
  Timezone::Lookup.config(:google) do |c|
    c.api_key = 'AIzaSyD-E3BgzwakcPnyVfsroPqsSZ7-bNE00s8'
  end

  before do
    response.headers["Access-Control-Allow-Origin"] = "*"
    if request.request_method == 'OPTIONS'
      response.headers["Access-Control-Allow-Origin"] = "*"
      response.headers["Access-Control-Allow-Methods"] = "GET"
      response.headers['Access-Control-Allow-Headers'] = 'origin, x-requested-with, accept'

      halt 200
    end
  end

  get '/:zip/city.json' do
    # Zipcode can be used to find latitude and longitude - but not city name
    geolocation_url = "#{NWS_ENDPOINT}?listZipCodeList=#{params[:zip]}"
    doc = Nokogiri::XML(open(geolocation_url))

    latitude, longitude = doc.xpath('//latLonList').first.children.first.content.split(",")

    # Ziptastic will return a city name for a zipcode
    results = Ziptastic.search(params[:zip])

    city = results.first
    city[:longitude] = longitude
    city[:latitude] = latitude

    content_type :json
    city.to_json
  end

  get '/:lat/:long/station.json' do
    nearest = settings.kd.nearest params[:lat].to_f, params[:long].to_f
    station = settings.stations[nearest]
    current_obs_url = "#{NWS_CURRENT_OBSERVATION}#{station}.xml"
    content_type :json
    {station: station, current_observation_xml: current_obs_url}.to_json
  end

  get '/:lat/:long/current.json' do
    nearest = settings.kd.nearest params[:lat].to_f, params[:long].to_f
    station = settings.stations[nearest]
    current_obs_url = "#{NWS_CURRENT_OBSERVATION}/#{station}.xml"
    doc = Nokogiri::XML(open(current_obs_url))
    temp = doc.xpath('//temp_f').first.content
    content_type :json
    {station: station, current_temperature_f: temp}.to_json
  end

  get '/:lat/:long/test' do
    start_date = Time.now.xmlschema
    end_date = (Time.now + (2*24*60*60)).xmlschema
    temp_forecast_url = "#{NWS_ENDPOINT}?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=#{start_date}&end=#{end_date}&temp=temp"
    temp_forecast_url
  end

  get '/:lat/:long/forecast.json' do
    timezone = Timezone.lookup(params[:lat].to_f, params[:long].to_f)
    nearest = settings.kd.nearest params[:lat].to_f, params[:long].to_f
    station = settings.stations[nearest]

    start_date = timezone.utc_to_local(Time.now).xmlschema[0..-5]
    end_date = timezone.utc_to_local(Time.now + (2*24*60*60)).xmlschema[0..-5]
    
    temp_forecast_url = "#{NWS_ENDPOINT}?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=#{start_date}&end=#{end_date}&temp=temp"
    current_obs_url = "#{NWS_CURRENT_OBSERVATION}/#{station}.xml"

    forecast_doc = Nokogiri::XML(open(temp_forecast_url))
    location = forecast_doc.xpath('//data/location/point')
    lat = location.attribute("latitude").value
    long = location.attribute("longitude").value

    current_obs_doc = Nokogiri::XML(open(current_obs_url))
    current_temp = current_obs_doc.xpath('//temp_f').first.content

    times = []
    forecast_doc.xpath('//data/time-layout').children.each do |time_element|
      if time_element.name == "start-valid-time"
        temp_time = DateTime.parse(time_element.children.first.to_s)
        times << temp_time.strftime("%Y-%m-%dT%H:%M:%S")
      end
    end

    temps = []
    temps << [timezone.utc_to_local(Time.now).strftime("%Y-%m-%dT%H:%M:%S"), current_temp.to_i]
    i = 0
    forecast_doc.xpath('//data/parameters/temperature').children.each do |temp_element|
      if temp_element.name == "value"
        temps << [times[i], temp_element.children.first.to_s.to_i]
        i += 1
      end
    end
    content_type :json
    temps.to_json
  end
end
