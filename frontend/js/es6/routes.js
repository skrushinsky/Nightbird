'use strict';

angular.module('app').config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/genres'
		})
		.when('/genres', {
			controller: 'GenresController',
			templateUrl: '/views/genres.html'
		})
		.when('/genres/:genreId', {
			controller: 'GenreController',
			templateUrl: '/views/genre.html'
		})
		.when('/artists/:artistId', {
			controller: 'ArtistController',
			templateUrl: '/views/artist.html'
		})
		.when('/albums/:albumId', {
			controller: 'AlbumController',
			templateUrl: '/views/album.html'
		})
		.otherwise({
			redirectTo: '/genres'
		});
	$locationProvider.html5Mode(true);
});
