/* Controllers */

angular.module('app').controller('GenresController', ($scope, $log, fetchPath, IMG_ROOT) => {
    const iconsMap = {
        'g.115': '14-pop.svg',
        'g.5': '28-art rock.svg',
        'g.33': '03-grunge.svg',
        'g.146': '17-rap.svg',
        'g.194': '32-soul.svg',
        'g.407': '10-country.svg',
        'g.299': '20-jazz.svg',
        'g.71': '16-electronic dance.svg',
        'g.510': '15-flamenco.svg',
        'g.488': '47-african music.svg',
        'g.383': '24-reggae.svg',
        'g.21': '11-classical.svg',
        'g.4': '04-glam rock.svg',
        'g.453': '23-new age.svg',
        'g.75': '42-christian music.svg',
        'g.438': '08-blues.svg',
        'g.446': '25-celtic music.svg',
        'g.69': '43-vocal.svg',
        'g.394': '05-heavy metal.svg',
        'g.246': '49-soundtrack.svg',
        'g.470': '35-children music.svg',
        'g.156': '46-comedy music.svg'
    }
    const refreshData = () => {
        fetchPath('genres')
        .then(data => {
            const genres = data.genres.filter( g => 'id' in g);
            for (let genre of genres) {
                if (genre.id in iconsMap) {
                    genre.image = `/img/genres/${iconsMap[genre.id]}`;
                } else {
                    $log.warn('Image for genre %s not found', genre.id);
                    genre.image = `/img/genres/${iconsMap['g.115']}`;
                }
            }
            $scope.genres = genres;
        }, notice => {
            $log.warn('Got notice: %s', notice);
            $scope.notice = notice;
        });
    }

    refreshData();
});
