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
    ).factory('nameComparator', () => {
        return (a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        }
    }).factory('dateComparator', () => {
        return (a, b) => a.date.getTime() - b.date.getTime()
    }
)
