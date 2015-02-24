(function() {
  var Serie, Torrent, calendarContent, month, monthNames, parseCalendar, parseEpisode, today;

  calendarContent = '';

  today = new Date();

  month = today.getMonth();

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  angular.module('home', []).config(function($compileProvider) {
    return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet):/);
  }).controller('HomeController', function($scope, $http) {
    var getSeriesDate, searchSeries;
    searchSeries = function(dateToSeach) {
      getSeriesDate(dateToSeach, $http, function(response) {
        $scope.seriesList = response;
        return $('#today').text(dateToSeach.getDate() + ' ' + monthNames[dateToSeach.getMonth()]);
      });
      return false;
    };
    getSeriesDate = function(dateToSearch, $http, success) {
      var monthCorrected, todayFormat;
      monthCorrected = dateToSearch.getMonth() + 1;
      todayFormat = '#d_' + dateToSearch.getDate() + '_' + monthCorrected + '_' + dateToSearch.getFullYear();
      if (calendarContent === '') {
        return $http.get('http://www.pogdesign.co.uk/cat/').success(function(data, status, headers, config) {
          if (status = 200) {
            calendarContent = data;
            return parseCalendar(todayFormat, success);
          } else {
            alert('something went wrong with the calendar connection: ' + response.statusCode);
            return calendarContent = '';
          }
        }).error(function() {
          return $scope.errorOnCall = true;
        });
      } else {
        return parseCalendar(todayFormat, success);
      }
    };
    $scope.getTorrents = function(serie) {
      var episode, urlRequest;
      $scope.serieSelected = serie;
      $scope.torrentList = [];
      episode = serie.serie.concat(' ').concat(serie.episode);
      episode = episode.replace(/\s/g, '%20');
      urlRequest = 'https://thepiratebay.se/search/' + episode + '/0/99/0';
      return $http.get(urlRequest).success(function(data, status, headers, config) {
        var desc, detLink, jresult, leeds, length, link, name, result, searchResult, seeds, torrent, torrentList, _i;
        searchResult = $(data).find('#searchResult').find('tr');
        torrentList = [];
        if (searchResult.length === 0) {
          if (typeof success === "function") {
            success(torrentList);
          }
        } else {
          length = searchResult.length > 3 ? 4 : searchResult.length;
          for (result = _i = 1; 1 <= length ? _i <= length : _i >= length; result = 1 <= length ? ++_i : --_i) {
            jresult = $(searchResult[result]);
            detLink = $(jresult.find(".detName")[0]).find(".detLink")[0];
            if (detLink !== void 0) {
              name = detLink.innerText;
              link = $(jresult.find("a[href^=magnet]")[0]).attr("href");
              desc = $(jresult.find("td")[1]).find(".detDesc").eq(0).text();
              seeds = jresult.find("td").eq(2).text();
              leeds = jresult.find("td").eq(3).text();
              torrent = new Torrent(name, leeds, seeds, link, desc);
              torrentList.push(torrent);
            }
          }
        }
        return $scope.torrentList = torrentList;
      });
    };
    searchSeries(new Date());
    $scope.goBack = function() {
      return $scope.torrentList = null;
    };
    $scope.previousDay = function() {
      today.setDate(today.getDate() - 1);
      if (month === today.getMonth()) {
        return searchSeries(today);
      } else {
        return today.setDate(today.getDate() + 1);
      }
    };
    return $scope.nextDay = function() {
      today.setDate(today.getDate() + 1);
      if (month === today.getMonth()) {
        return searchSeries(today);
      } else {
        return today.setDate(today.getDate() - 1);
      }
    };
  });

  parseCalendar = function(todayFormat, success) {
    var as, className, div, divs, jdiv, serie, serieEpisode, serieEpisodeString, serieId, serieList, serieTitleString, _i, _len;
    divs = $(calendarContent).find(todayFormat).find('div');
    serieList = [];
    serieId = 0;
    for (_i = 0, _len = divs.length; _i < _len; _i++) {
      div = divs[_i];
      jdiv = $(div);
      className = jdiv.find('p')[0].className;
      as = jdiv.find('a');
      serieTitleString = as[0].text;
      serieEpisode = as[1];
      serieEpisodeString = parseEpisode(serieEpisode.text);
      serie = new Serie(serieTitleString, serieEpisodeString, className, serieId);
      serieList.push(serie);
      serieId++;
    }
    return typeof success === "function" ? success(serieList) : void 0;
  };

  parseEpisode = function(epInput) {
    var ep, episode, season, splitted;
    episode = '';
    splitted = epInput.split(' ');
    season = splitted[1];
    ep = splitted[4];
    if (season.length < 2) {
      episode += 's0' + season;
    } else {
      episode += 's' + season;
    }
    if (ep.length < 2) {
      episode += 'e0' + ep;
    } else {
      episode += 'e' + ep;
    }
    return episode;
  };

  Serie = (function() {
    function Serie(serie, episode, className, serieId) {
      this.serie = serie;
      this.episode = episode;
      this.className = className;
      this.serieId = serieId;
    }

    return Serie;

  })();

  Torrent = (function() {
    function Torrent(name, leeds, seeds, link, desc) {
      this.name = name;
      this.leeds = leeds;
      this.seeds = seeds;
      this.link = link;
      this.desc = desc;
    }

    return Torrent;

  })();

}).call(this);
