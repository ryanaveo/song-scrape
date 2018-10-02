const express         = require("express"),
      app             = express(),
      config          = require("./config/main"),
      bodyParser      = require("body-parser"),
      passport        = require("passport"),
      session         = require("express-session"),
      middleware      = require("./middleware"),
      request         = require("request"),
      SpotifyStrategy = require("passport-spotify").Strategy,
      spotify         = require("./api/spotify");

// APP CONFIGURATIONS
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT SESSION SETUP
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
		clientID: config.spotifyKey,
		clientSecret: config.spotifySecret,
		callbackURL: "http://localhost:3000/callback"
	},
	function(accessToken, refreshToken, expires_in, profile, done) {
		// where we will store user's tokens and information (GLOBAL)
		spotify.API.setAccessToken(accessToken);
		spotify.API.setRefreshToken(refreshToken);
		userInfo = {
			name: profile.displayName,
			id: profile.id
		}
		return done(null, profile);
	})
)

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
	scope: ["playlist-modify-private","user-top-read", "playlist-read-private"],
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
	var likedGenres = await spotify.getLikedGenres();
	var playlist = await spotify.getPlaylist(userInfo);
	if (!playlist.id) {
		playlist.id = await spotify.createPlaylist();
	}
	var playlistURL = "https://open.spotify.com/user/" + playlist.owner + "/playlist/" + playlist.id
	var embedRequestOptions = {
		method: "GET",
		uri: "https://embed.spotify.com/oembed",
		qs: {
			url: playlistURL,
			format: "json"
		},
		json: true,
		headers: {'user-agent': 'node.js'}
	}
	var embedHTML = ""
	request(embedRequestOptions, function(err, response, body) {
		embedHTML = response.body.html;
	});
	// 	results will be an array of the 50 hot posts from /r/listen to this
	PythonShell.run("get_listentothis_hot_posts.py", options, async function(err, results) {
		if (err) res.redirect("back");
		var re = /[-]+/
		var trackURIs = []
		console.time("Creating Query and Adding to Playlist");
		var queries = await spotify.createQueryList(results, likedGenres);
		var trackURIs = await spotify.createTrackURIList(queries);
		spotify.addSongs(trackURIs, playlist.id);
		console.timeEnd("Creating Query and Adding to Playlist");
		res.render("playlist/show", {embedHTML: embedHTML});

	})
});

app.get("/playlist", middleware.isLoggedIn, function(req, res){
	res.render("playlist/show");
});

app.listen(config.port, function() {
	console.log("Server running on localhost:" + config.port);
})
