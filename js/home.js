(function() {
  var calendarContent, getSeriesDate, searchSeries;

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
      return $http.get('http://www.pogdesign.co.uk/cat', function(error, response, body) {
        if (response.statusCode === 200) {
          calendarContent = body;
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

  this.parseCalendar = function(todayFormat, success) {
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

}).call(this);
