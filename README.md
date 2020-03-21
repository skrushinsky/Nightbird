# NightBird

Nightbird is a guide to modern and classical music, based on
[Napster](https://us.napster.com/music) online service. With its help it is
easy to:

* Investigate musical genres: artists, history, mutual influences.

* Search songs, musicians, composers, albums — from famous to little-known.

* Listen to hundreds of audio samples.

* Compare dozens of performances of your favourite song.

## Platform

Nightbird is a PWA application, available from addresshttps://nightbird.su.
Most of the work is done at the frontend, by [AngularJS](https://angularjs.org/)
framework.  

## Requirements

* [Node.JS](https://nodejs.org/en/) >= 12.14
* [Gulp 4](https://gulpjs.com/), installed globally.

Tested on Linux 64-bit, MacOS 10.14 and Windows 10. There should be no problems at other platforms.

## Installation

To install this module, run the following commands from the application folder:

```
$ npm install
$ gulp
```

On Windows instead of a single `gulp` command you have to run:

```
gulp build
npm start
```   
Then open your browser and navigate to http://localhost:3000/.
