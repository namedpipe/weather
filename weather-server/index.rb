require 'sinatra'
require 'json'
require 'open-uri'
require 'nokogiri'
require 'date'
require 'redis'

before do
  if request.request_method == 'OPTIONS'
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET"
    response.headers['Access-Control-Allow-Headers'] = 'origin, x-requested-with, accept'

    halt 200
  end
end

get '/:lat/:long/test' do
  headers["Access-Control-Allow-Origin"] = "*"
  temp_forecast_url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=2004-01-01T00:00:00&end=2013-04-20T00:00:00&temp=temp"
  temp_forecast_url
end

get '/:lat/:long/forecast.json' do
  headers["Access-Control-Allow-Origin"] = "*"
  temp_forecast_url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=#{params[:lat]}&lon=#{params[:long]}&product=time-series&begin=2004-01-01T00:00:00&end=2013-04-20T00:00:00&temp=temp"
  doc = Nokogiri::HTML(open(temp_forecast_url))
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

