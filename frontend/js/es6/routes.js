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
		.when('/genres/:genreId/children', {
			controller: 'SubGenresController',
			templateUrl: '/views/subgenres.html'
		})
		.when('/genres/:genreId/tracks', {
			controller: 'GenreTracksController',
			templateUrl: '/views/genre_tracks.html'
		})
		.when('/genres/:genreId/artists', {
			controller: 'GenreArtistsController',
			templateUrl: '/views/genre_artists.html'
		})
		.when('/artists/:artistId', {
			controller: 'ArtistController',
			templateUrl: '/views/artist.html'
		})
		.when('/albums/:albumId', {
			controller: 'AlbumController',
			templateUrl: '/views/album.html'
		})
		.when('/search/results', {
			controller: 'ResultsController',
			templateUrl: '/views/results.html'
		})
		.otherwise({
			redirectTo: '/genres'
		});
	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
