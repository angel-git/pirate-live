calendarContent = ''
today = new Date()
month = today.getMonth()

monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ]

angular.module('home', [])
  .config ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet):/)
  .controller 'HomeController', ($scope, $http) ->


    searchSeries = (dateToSeach) ->
      getSeriesDate dateToSeach, $http, (response) ->
        $scope.seriesList = response
        $('#today').text(dateToSeach.getDate()+ ' ' + monthNames[dateToSeach.getMonth()])
      return false

    getSeriesDate = (dateToSearch, $http, success) ->
      monthCorrected = dateToSearch.getMonth() + 1
      todayFormat = '#d_' + dateToSearch.getDate() + '_' + monthCorrected + '_' + dateToSearch.getFullYear()
      if calendarContent is ''
        $http.get('http://www.pogdesign.co.uk/cat/').success (data, status, headers, config) ->
          if status = 200
            calendarContent = data
            parseCalendar(todayFormat, success)
          else
            alert('something went wrong with the calendar connection: ' + response.statusCode)
            calendarContent = ''
        .error () ->
          $scope.errorOnCall = true
      else
        parseCalendar(todayFormat, success)


    $scope.getTorrents = (serie) ->
      $scope.serieSelected = serie
      $scope.torrentList = []
      episode = serie.serie.concat(' ').concat(serie.episode)
      episode = episode.replace /\s/g,'%20'
      urlRequest = 'http://thepiratebay.se/search/'+ episode + '/0/7/0'
      $http.get(urlRequest).success (data, status, headers, config) ->
        searchResult = $(data).find('#searchResult').find('tr')
        torrentList = []
        if searchResult.length == 0
          success? torrentList
        else
          length = if (searchResult.length > 3) then 4 else searchResult.length
          for result in [1..length]
            jresult = $(searchResult[result])
            detLink = $(jresult.find(".detName")[0]).find(".detLink")[0]
            name = detLink.text
            link = $(jresult.find("a[href^=magnet]")[0]).attr("href")
            desc = $(jresult.find("td")[1]).find(".detDesc").eq(0).text()
            seeds = jresult.find("td").eq(2).text()
            leeds = jresult.find("td").eq(3).text()
            torrent = new Torrent(name, leeds, seeds, link, desc)
            torrentList.push(torrent)
        $scope.torrentList = torrentList

    searchSeries(new Date())

    $scope.goBack = () ->
      $scope.torrentList = null


    $scope.previousDay = () ->
      today.setDate(today.getDate()-1)
      if month == today.getMonth()
        searchSeries(today)
      else
        today.setDate(today.getDate()+1)

    $scope.nextDay = () ->
      today.setDate(today.getDate()+1)
      if month == today.getMonth()
        searchSeries(today)
      else
        today.setDate(today.getDate()-1)


parseCalendar = (todayFormat, success) ->
  divs = $(calendarContent).find(todayFormat).find('div');
  serieList = []
  serieId = 0
  for div in divs
    jdiv = $(div)
    className = jdiv.find('p')[0].className
    as = jdiv.find('a')
    serieTitleString = as[0].text
    serieEpisode = as[1]
    serieEpisodeString = parseEpisode(serieEpisode.text)
    serie = new Serie(serieTitleString, serieEpisodeString, className, serieId)
    serieList.push(serie)
    serieId++
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
  constructor: (@serie, @episode, @className, @serieId) ->

class Torrent
  constructor: (@name, @leeds, @seeds, @link, @desc) ->