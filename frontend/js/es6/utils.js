angular.module('app')
    .factory('loadImage', ($q, $log) =>
        (imageUrl, defaultUrl) => {
            const deferred = $q.defer();
            const image = new Image();
            image.onerror = () => deferred.resolve(defaultUrl);
            image.onload = () => deferred.resolve(imageUrl);
            image.src = imageUrl;
            return deferred.promise;
        }
    ).factory('shuffleArray', () =>
        a => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    )
