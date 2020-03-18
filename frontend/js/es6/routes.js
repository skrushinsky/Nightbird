'use strict';

angular.module('app').config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/genres'
		})
		.when('/genres', {
			controller: 'GenresListController',
			templateUrl: '/views/genre/index.html'
		})
		.when('/genres/:genreId', {
			controller: 'GenreController',
			templateUrl: '/views/genre.html'
		})
		.when('/genres/:genreId/tracks', {
			controller: 'GenreTracksController',
			templateUrl: '/views/genre/tracks.html'
		})
		.when('/genres/:genreId/artists', {
			controller: 'GenreArtistsController',
			templateUrl: '/views/genre/artists.html'
		})
		.when('/artists/:artistId', {
			controller: 'ArtistController',
			templateUrl: '/views/artist.html'
		})
		.when('/artists/:artistId/albums', {
			controller: 'ArtistAlbumsController',
			templateUrl: '/views/artist/albums.html'
		})
        .when('/artists/:artistId/tracks', {
			controller: 'ArtistTracksController',
			templateUrl: '/views/artist/tracks.html'
		})
		.when('/albums/:albumId', {
			controller: 'AlbumController',
			templateUrl: '/views/album.html'
		})
        .when('/search/wait', {
			controller: 'WaitController',
			templateUrl: '/views/search/wait.html'
		})
		.when('/search/results', {
			controller: 'ResultsController',
			templateUrl: '/views/search/results.html'
		})
		.when('/about', {
			controller: 'AbouController',
			templateUrl: '/views/about.html'
		})
		.otherwise({
			redirectTo: '/genres'
		});
	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
