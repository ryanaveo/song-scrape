var spotifyObj = {}

spotifyObj.createPlaylist() {
	spotifyApi.createPlaylist(userInfo.id, "Listen to This", {public: false}) // create playlist
		.then(function(data) {
			console.log("Created playlist");
		},
		function(err) {
			console.log(err);
	});
}

module.exports = spotifyObj;