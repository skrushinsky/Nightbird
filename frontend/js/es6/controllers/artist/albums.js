/* Controllers */

angular.module('app').controller('ArtistAlbumsController', ($scope, $log, $route, $routeParams, $location, fetchAlbums, getArtist, loadImage, dateComparator, IMG_ROOT) => {
	$scope.albums = [];

	const loadAlbumImage = album => loadImage(
		`${IMG_ROOT}/v2/albums/${album.id}/images/300x300.jpg`,
		'/img/default/album.jpg'
	).then(src => album.image = src);


	getArtist($routeParams.artistId)
		.then(
			artist => {
				$scope.artist = artist;
				$scope.gotoArtist = id => $location.path(`/artists/${id}`);
				fetchAlbums(`/artists/${artist.id}/albums/top`)
					.then(albums => {
						$scope.albums = albums.map(album => {
							album.date = new Date(Date.parse(album.originallyReleased));
							loadAlbumImage(album);
							album.callback = () => $location.path(`/albums/${album.id}`);
							return album;
						}).sort(dateComparator);
						if ($scope.albums.length) {
							$scope.activeSlide = $scope.albums[0].id;
						}
					}, notice => {
						$log.warn('Got notice: %s', notice);
						$scope.notice = notice;
					});
			}
		);

});
