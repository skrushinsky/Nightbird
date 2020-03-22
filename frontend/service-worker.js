const CACHE_NAME = 'nightbird-v1.2';

const STATIC_FILES = [
    '/',
    '/manifest.json',
    '/bootstrap/css/bootstrap.min.css',
    '/fonts/roboto-fontface/css/roboto/roboto-fontface.css',
    '/css/nightbird.css',
    '/css/wait.css',
    '/css/about.css',
    '/css/blurbs.css',
    '/js/lib/angular.min.js',
    '/js/lib/angular-animate.min.js',
    '/js/lib/angular-route.min.js',
    '/js/lib/angular-sanitize.min.js',
    '/js/lib/ui-bootstrap.js',
    '/js/lib/ui-bootstrap-tpls.js',
    '/js/app.js',
    '/js/api.js',
    '/js/api.routes',
    '/js/search.js',
    '/js/utils.js',
    '/js/controllers/album.js',
    '/js/controllers/artist.js',
    '/js/controllers/genre.js',
    '/js/controllers/navbar.js',
    '/js/controllers/results.js',
    '/js/controllers/search.js',
    '/js/controllers/wait.js',
    '/js/controllers/artist/albums.js',
    '/js/controllers/artist/tracks.js',
    '/js/controllers/genre/index.js',
    '/js/controllers/genre/artists.js',
    '/js/controllers/genre/tracks.js',
    '/js/controllers/about.js',
    '/js/controllers/terms.js',
    '/js/directives/album_details.js',
    '/js/directives/blurbs.js',
    '/js/directives/genres.js',
    '/js/directives/labels.js',
    '/js/directives/links.js',
    '/js/directives/picture.js',
    '/js/directives/results.js',
    '/js/directives/slideshow.js',
    '/js/directives/tracks.js',
    '/js/directives/wait.js',
    '/img/icons/icon128x128.png',
    '/img/default/album.jpg',
    '/img/default/artist.jpg',
    '/img/default/track.jpg',
    '/views/album.html',
    '/views/artist.html',
    '/views/genre.html',
    '/views/navbar.html',
    '/views/footer.html',
    '/views/artist/albums.html',
    '/views/artist/tracks.html',
    '/views/genre/artists.html',
    '/views/genre/index.html',
    '/views/genre/tracks.html',
    '/views/search/results.html',
    '/views/search/wait.html',
    '/views/about.html',
    '/views/terms.html',
    '/favicon.ico',
    '/img/genres/01-punk.svg',
    '/img/genres/02-goth.svg',
    '/img/genres/03-grunge.svg',
    '/img/genres/04-glam rock.svg',
    '/img/genres/05-heavy metal.svg',
    '/img/genres/06-black metal.svg',
    '/img/genres/07-rockabilly - rock.svg',
    '/img/genres/08-blues.svg',
    '/img/genres/09-choral.svg',
    '/img/genres/10-country.svg',
    '/img/genres/11-classical.svg',
    '/img/genres/12-medieval.svg',
    '/img/genres/13-indie pop - pop.svg',
    '/img/genres/14-pop.svg',
    '/img/genres/15-flamenco.svg',
    '/img/genres/16-electronic dance.svg',
    '/img/genres/17-rap.svg',
    '/img/genres/18-gospel.svg',
    '/img/genres/19-march.svg',
    '/img/genres/20-jazz.svg',
    '/img/genres/21-k pop.svg',
    '/img/genres/22-salsa.svg',
    '/img/genres/23-new age.svg',
    '/img/genres/24-reggae.svg',
    '/img/genres/25-celtic music.svg',
    '/img/genres/26-opera.svg',
    '/img/genres/27-gregorian chants.svg',
    '/img/genres/28-art rock.svg',
    '/img/genres/29-mariachi.svg',
    '/img/genres/30-indie folk.svg',
    '/img/genres/31-fitnesss and workout.svg',
    '/img/genres/32-soul.svg',
    '/img/genres/33-funk.svg',
    '/img/genres/34-disco.svg',
    '/img/genres/35-children music.svg',
    '/img/genres/36-polka.svg',
    '/img/genres/37-nu metal.svg',
    '/img/genres/38-emo.svg',
    '/img/genres/39-jingles.svg',
    '/img/genres/40-lounge music.svg',
    '/img/genres/41-holiday music.svg',
    '/img/genres/42-christian music.svg',
    '/img/genres/43-vocal.svg',
    '/img/genres/44-r&b.svg',
    '/img/genres/45-punk rock.svg',
    '/img/genres/46-comedy music.svg',
    '/img/genres/47-african music.svg',
    '/img/genres/48-surf music.svg',
    '/img/genres/49-soundtrack.svg',
    '/img/genres/50-indian music.svg',
    '/img/icons/icon-96x96.png',
    '/img/icons/icon-128x128.png',
    '/img/icons/icon-144x144.png',
    '/img/icons/icon-152x152.png',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-384x384.png',
    '/img/icons/icon-512x512.png',
    '/img/facebook.png'
];


// clear old caches
function clearOldCaches() {
    return caches.keys().then(keylist => {
        return Promise.all(
            keylist.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
    });
}

// Cache our known resources during install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_FILES))
    );
});


// application activated
self.addEventListener('activate', event => {
    console.log('service worker: activate');
    event.waitUntil(
        clearOldCaches().then(() => self.clients.claim())
    );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }
    caches.match(event.request, {
        ignoreSearch: false
    }).then(
        response => {
            if (response) {
                return response;
            }
            const requestToCache = event.request.clone();
            return fetch(requestToCache).then(
                response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(
                        cache => cache.put(requestToCache, responseToCache)
                    );
                }
            );
        }
    );
});
