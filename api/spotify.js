const SpotifyWebApi = require("spotify-web-api-node"),
      config        = require("../config/main");

var spotify = {
	API: new SpotifyWebApi({
					clientId: config.spotifyKey,
					clientSecret: config.spotifySecret,
					callbackURL: "http://localhost:3000/callback"
				})
}

spotify.getLikedGenres = async function() {
	var likedGenres = new Set();
	let data = await this.API.getMyTopArtists();
	data.body.items.forEach(function(artist) {
		artist.genres.forEach(function(genre) {
			likedGenres.add(genre);
		});
	});
	return likedGenres;
}

/*
	Returns playlist ID if "Listen to This playlist exits. Returns an empty string if it doesn't"
*/
spotify.getPlaylistID = async function(userInfo) {
	var playlistData = await this.API.getUserPlaylists();
	var playlistData = playlistData.body.items

	for (let i = 0; i < playlistData.length; i++) {
		if (playlistData[i].name == "Listen to This" && playlistData[i].owner["display_name"] == userInfo.name) {
			return playlistData[i].id;
		}
	}
	return "";
}

/*
	Create playlist and return its ID
*/
spotify.createPlaylist = async function() {
	var data = await this.API.createPlaylist(userInfo.id, "Listen to This", {public: false}); // create playlist
	return data.body.id;
}

/*
	Parse reddit post titles to create a list of search queries in the format of "title artist"
*/
spotify.createQueryList = async function(redditPosts, likedGenres) {
	var re = /[-]+/
	var queryList = [];
	tracks:
		for (let index = 0; index < redditPosts.length; index++) {
			track = redditPosts[index].replace(/\u2013|\u2014/g, "-");
			track = track.split(re);
			if(track.length == 2) {
				var artist = track[0].trim().toLowerCase();
				var title = track[1].substring(0,track[1].indexOf("[")).trim();
				var genre = track[1].match(/\[([^\]]+)/)[1];
				if (genre) {
					genre = genre.toLowerCase();
					genre.replace(",", "/");
					var genreList = genre.split("/");
				}
				var query = {
								title: title,
								artist: artist
							}
				genres:
					for (let index = 0; index < genreList.length; index++) {
						if (likedGenres.has(genreList[index].trim())) {
							queryList.push(query);
							break genres;
						}
					}
			}
		}
	return queryList;
}

/*
	Takes in a list of search queries to search for song on spotify. If correct, adds to playlist.
*/
spotify.createTrackURIList = async function(queries) {
	var trackURIs = []
	for (var query_index = 0; query_index < queries.length; query_index++) {
		let data = await this.API.searchTracks(queries[query_index].title + " " + queries[query_index].artist, {limit: 3});
		tracks:
			for (let i = 0; i < data.body.tracks.items.length; i++) {
				song = data.body.tracks.items[i];
				artists:
					for (let i = 0; i < song.artists.length; i++) {
						if (song.artists[i].name.toLowerCase() == queries[query_index].artist) {
							trackURIs.push(song["uri"]);
							break tracks;
						}
					}
			}
	}
	return trackURIs;
}

spotify.addSongs = async function(trackURIs,playlistID) {
	console.log(trackURIs);
	var data = await this.API.replaceTracksInPlaylist(playlistID, trackURIs);
	console.log(data);
	return data;
}

module.exports = spotify;