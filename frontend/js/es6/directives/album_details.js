angular.module('app').directive('nbAlbumDetails', function() {
    return {
        template : `
        <table class="table table-striped details">
            <tr ng-show="album.artistName">
                <td>Artist:</td>
                <td>
                    <a ng-if="album.contributingArtists.primaryArtist" href="/artists/{{album.contributingArtists.primaryArtist}}">
                        {{ album.artistName }}
                    </a>
                    <span ng-if="!album.contributingArtists.primaryArtist">
                        {{ album.artistName }}
                    </span>
                </td>
            </tr>
            <tr ng-show="album.released">
                <td>Released:</td>
                <td>{{ album.released | date : "longDate" }}</td>
            </tr>
            <tr ng-show="album.originallyReleased">
                <td>Originally Released:</td>
                <td>{{ album.originallyReleased | date : "longDate" }}</td>
            </tr>
            <tr ng-show="album.label">
                <td>Label:</td>
                <td>{{ album.label }}</td>
            </tr>
            <tr ng-show="album.copyright && album.label != album.copyright">
                <td>Copyright:</td>
                <td>{{ album.copyright }}</td>
            </tr>
            <tr ng-show="album.discCount">
                <td>Discs: </td>
                <td>{{ album.discCount }}</td>
            </tr>
            <tr ng-show="artists.length > 0">
                <td>Artists: </td>
                <td>
                    <nb-links links="artists"/>
                </td>
            </tr>
        </table>
        `,
        restrict: 'E',
        scope: {
            album: '=',
        }
    }
});
