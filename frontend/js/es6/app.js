'use strict';
// Application module

angular.module('app', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAnimate', 'ui.bootstrap'])
	.filter('formatSeconds', $filter =>
		s => new Date(s * 1000).toISOString().substr(14, 5)
	).config(['$compileProvider',
		function($compileProvider) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
		}
	]).run(($rootScope) => {
        document.addEventListener('play', e => {
            for(let audio of document.getElementsByTagName('audio') ) {
                if(audio != e.target){
                    audio.pause();
                }
            }
        }, true);
    });
