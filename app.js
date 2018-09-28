const express = require("express"),
      app     = express(),
      port    = 3000,
      bodyParser = require("body-parser"),
      passport = require("passport"),
      session = require("express-session"),
      middleware = require("./middleware"),
      SpotifyStrategy = require("passport-spotify").Strategy,
      SpotifyWebApi = require("spotify-web-api-node"),
      spotifyKey = process.env.SPOTIFYKEY,
      spotifySecret = process.env.SPOTIFYSECRET;

var spotifyApi = new SpotifyWebApi({
	clientId: spotifyKey,
	clientSecret: spotifySecret,
	callbackURL: "http://localhost:3000/callback"
});

// APP CONFIGURATIONS
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT SESSION SETUP
// since no database of users, complete spotify profile is serialized and deserialized
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// SPOTIFY STRATEGY
passport.use(
	new SpotifyStrategy(
	{
		clientID: spotifyKey,
		clientSecret: spotifySecret,
		callbackURL: "http://localhost:3000/callback"
	},
	function(accessToken, refreshToken, expires_in, profile, done) {
		// where we will store user's tokens and information (GLOBAL)
		spotifyApi.setAccessToken(accessToken);
		spotifyApi.setRefreshToken(refreshToken);
		userInfo = {
			name: profile.displayName,
			id: profile.id
		}
		return done(null, profile);
	}))

app.use(session({
	secret: "avocado toast",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// defines who is currently logged in, every template and route will have this
app.use(function(req, res, next){
	res.locals.user = req.user;
	next(); // need this next or it will just stop.
});

// AUTHENTICATE REQUEST FROM SPOTIFY
app.get("/auth/spotify", passport.authenticate("spotify", {
	scope: ["playlist-modify-public","user-top-read"],
	showDialog: true
}),
	function(req,res) {}
);

app.get("/callback", passport.authenticate("spotify", {failureRedirect: "/"}), function(req, res){
	console.log("Logged in!");
	res.redirect("/");
})

app.get("/", function(req, res){
	res.render("index");
})

// create playlist
app.post("/", middleware.isLoggedIn, async function(req, res) {
	// GETTING REDDIT DATA
	let {PythonShell} = require("python-shell");

	let options = {
  		mode: 'text',
  		pythonOptions: ['-u'], // get print results in real-time
	};

	// get favorite genres from user to compare later with r/listentothis tracks
	var likedGenres = new Set();
	let data = await spotifyApi.getMyTopArtists();
	data.body.items.forEach(function(artist) {
		artist.genres.forEach(function(genre) {
			likedGenres.add(genre);
		});
	});

	var playlistExists = false;
	var playlistData = await spotifyApi.getUserPlaylists();
	var playlistData = playlistData.body.items
	for (let i = 0; i < playlistData.length; i++) {
		if (playlistData[i].name == "Listen to This" && playlistData[i].owner["display_name"] == userInfo.name) {
			playlistExists = true;
		}
	}

	if (!playlistExists) {
		await spotifyApi.createPlaylist(userInfo.id, "Listen to This", {public: true}); // create playlist
	}

	// PythonShell.run("get_listentothis_hot_posts.py", options, function(err, results) {
	// 		if (err) res.redirect("back");
	// 		// results will be an array of the 50 hot posts from /r/listen to this
	// 		var re = /[-]+/
	// 		results.forEach( async function(track){
	// 			// track splits string by the dashes
	// 			track = track.replace(/\u2013|\u2014/g, "-");
	// 			track = track.split(re);
	// 			if(track.length == 2) {
	// 				var artist = track[0].trim().toLowerCase();
	// 				var title = track[1].substring(0,track[1].indexOf("["));
	// 				var genre = track[1].match(/\[([^\]]+)/)[1];
	// 				if (genre) {
	// 					genre = genre.toLowerCase();
	// 				}
	// 				if (likedGenres.has(genre)) {
	// 					let data = await spotifyApi.searchTracks(title + " " + artist, {limit: 3});

	// 					tracks:
	// 						for (let i = 0; i < data.body.tracks.items.length; i++) {
	// 							song = data.body.tracks.items[i];
	// 							artists:
	// 								for (let i = 0; i < song.artists.length; i++) {
	// 									if (song.artists[i].name.toLowerCase() == artist) {
	// 										console.log(artist);
	// 										console.log(song.name);
	// 										break tracks;
	// 									}
	// 								}
	// 						}
	// 				}
	// 			}
	// 		})
			res.redirect("/playlist");


	// });
});
app.get("/playlist", middleware.isLoggedIn, function(req, res){
	res.render("playlist/show");
});

// // SHOW CREATE PLAYLIST FORM
// app.get("/playlist/", middleware.isLoggedIn, function(req, res){
// 	res.render("playlist/new");
// })


app.listen(3000, function() {
	console.log("Server running on localhost:" + port);
})
