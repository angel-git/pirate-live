(function() {
  var Serie, Torrent, calendarContent, parseCalendar, parseEpisode;

  calendarContent = '';

  angular.module('home', []).controller('HomeController', function($scope, $http) {
    var getSeriesDate, searchSeries;
    searchSeries = function(dateToSeach) {
      return getSeriesDate(dateToSeach, $http, function(response) {
        return $scope.seriesList = response;
      });
    };
    getSeriesDate = function(dateToSearch, $http, success) {
      var month, todayFormat;
      month = dateToSearch.getMonth() + 1;
      todayFormat = '#d_' + dateToSearch.getDate() + '_' + month + '_' + dateToSearch.getFullYear();
      if (calendarContent === '') {
        return $http.get('http://www.pogdesign.co.uk/cat/').success(function(data, status, headers, config) {
          if (status = 200) {
            calendarContent = data;
            return parseCalendar(todayFormat, success);
          } else {
            alert('something went wrong with the calendar connection: ' + response.statusCode);
            return calendarContent = '';
          }
        });
      } else {
        return parseCalendar(todayFormat, success);
      }
    };
    $scope.getTorrents = function(serie) {
      var episode, urlRequest;
      episode = serie.serie.concat(' ').concat(serie.episode);
      episode = episode.replace(/\s/g, '%20');
      urlRequest = 'http://thepiratebay.se/search/' + episode + '/0/7/0';
      return $http.get(urlRequest).success(function(data, status, headers, config) {
        var desc, detLink, jresult, leeds, link, name, result, searchResult, seeds, torrent, torrentList, _i, _ref;
        searchResult = $(data).find('#searchResult').find('tr');
        torrentList = [];
        if (searchResult.length === 0) {
          if (typeof success === "function") {
            success(torrentList);
          }
        } else {
          for (result = _i = 1, _ref = searchResult.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; result = 1 <= _ref ? ++_i : --_i) {
            jresult = $(searchResult[result]);
            detLink = $(jresult.find(".detName")[0]).find(".detLink")[0];
            name = detLink.text;
            link = $(jresult.find("a[href^=magnet]")[0]).attr("href");
            desc = $(jresult.find("td")[1]).find(".detDesc").eq(0).text();
            seeds = jresult.find("td").eq(2).text();
            leeds = jresult.find("td").eq(3).text();
            torrent = new Torrent(name, leeds, seeds, link, desc);
            torrentList.push(torrent);
          }
        }
        console.log(torrentList);
        return $scope.torrentList = torrentList;
      });
    };
    searchSeries(new Date());
    return $scope.goBack = function() {
      return $scope.torrentList = null;
    };
  });

  parseCalendar = function(todayFormat, success) {
    var as, className, div, divs, jdiv, serie, serieEpisode, serieEpisodeString, serieList, serieTitleString, _i, _len;
    divs = $(calendarContent).find(todayFormat).find('div');
    serieList = [];
    for (_i = 0, _len = divs.length; _i < _len; _i++) {
      div = divs[_i];
      jdiv = $(div);
      className = jdiv.find('p')[0].className;
      as = jdiv.find('a');
      serieTitleString = as[0].text;
      serieEpisode = as[1];
      serieEpisodeString = parseEpisode(serieEpisode.text);
      serie = new Serie(serieTitleString, serieEpisodeString, className);
      serieList.push(serie);
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
    function Serie(serie, episode, className) {
      this.serie = serie;
      this.episode = episode;
      this.className = className;
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
