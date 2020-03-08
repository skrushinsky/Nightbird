angular.module('app')
.factory('loadImage', ($q, $log) =>
    (imageUrl, defaultUrl) => {
        const deferred = $q.defer();
        const image = new Image();
        image.onerror = () => deferred.resolve(defaultUrl);
        image.onload = ()  => deferred.resolve(imageUrl);
        image.src = imageUrl;
        return deferred.promise;
    }
)
