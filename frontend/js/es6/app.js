'use strict';
// Application module

angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAnimate', 'ui.bootstrap'])

	.config(function($locationProvider) {
		$locationProvider.hashPrefix('!');
		//$locationProvider.html5Mode(true);
	}).config(['$compileProvider',
		function($compileProvider) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
		}
	]).config(function($routeProvider) {
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
            .otherwise ({
                redirectTo: '/genres'
            });
    }).run(($rootScope) => {
        document.addEventListener('play', e => {
            for(let audio of document.getElementsByTagName('audio') ) {
                if(audio != e.target){
                    audio.pause();
                }
            }
        }, true);
    });
