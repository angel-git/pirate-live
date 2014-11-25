(function() {
  var Serie, Torrent, calendarContent, getSeriesDate, parseCalendar, parseEpisode, searchSeries;

  calendarContent = '';

  angular.module('home', []).controller('HomeController', function($scope, $http) {
    return searchSeries(new Date(), $http);
  });

  searchSeries = function(dateToSeach, $http) {
    return getSeriesDate(dateToSeach, $http, function(response) {
      return console.log(response);
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
