calendarContent = ''

angular.module('home', [])
  .controller 'HomeController', ($scope, $http) ->
    searchSeries(new Date(), $http)





searchSeries = (dateToSeach, $http) ->
  getSeriesDate dateToSeach, $http, (response) ->
    console.log response

getSeriesDate = (dateToSearch, $http, success) ->
  month = dateToSearch.getMonth() + 1
  todayFormat = '#d_' + dateToSearch.getDate() + '_' + month + '_' + dateToSearch.getFullYear()
  if calendarContent is ''
    $http.get('http://www.pogdesign.co.uk/cat/').success (data, status, headers, config) ->
      if status = 200
        calendarContent = data
        parseCalendar(todayFormat, success)
      else
        alert('something went wrong with the calendar connection: ' + response.statusCode)
        calendarContent = ''
  else
    parseCalendar(todayFormat, success)

parseCalendar = (todayFormat, success) ->
  divs = $(calendarContent).find(todayFormat).find('div');
  serieList = []
  for div in divs
    jdiv = $(div)
    className = jdiv.find('p')[0].className
    as = jdiv.find('a')
    serieTitleString = as[0].text
    serieEpisode = as[1]
    serieEpisodeString = parseEpisode(serieEpisode.text)
    serie = new Serie(serieTitleString, serieEpisodeString, className)
    serieList.push(serie)
  success? serieList

parseEpisode = (epInput) ->
  episode = ''
  splitted = epInput.split(' ')
  season = splitted[1]
  ep = splitted[4]
  if season.length < 2
    episode += 's0' + season
  else
    episode += 's' + season
  if ep.length < 2
    episode += 'e0' + ep
  else
    episode += 'e' + ep
  return episode


class Serie
  constructor: (@serie, @episode, @className) ->

class Torrent
  constructor: (@name, @leeds, @seeds, @link, @desc) ->