const express = require("express"),
      app     = express(),
      port    = 3000,
      bodyParser = require("body-parser"),
      passport = require("passport"),
      session = require("express-session"),
      middleware = require("./middleware"),
      SpotifyStrategy = require("passport-spotify").Strategy,
      spotifyKey = process.env.SPOTIFYKEY,
      spotifySecret = process.env.SPOTIFYSECRET;

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
		console.log(profile);
		// where we will store user's tokens and information (GLOBAL)
		userInfo = {
			name: profile.displayName,
			accessToken: accessToken,
			refreshToken: refreshToken
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
	scope: ["playlist-modify-private","user-top-read"],
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
app.post("/", middleware.isLoggedIn, function(req, res) {
	console.log(userInfo);
	// // GETTING REDDIT DATA
	// let {PythonShell} = require("python-shell");

	// let options = {
 //  		mode: 'text',
 //  		pythonOptions: ['-u'], // get print results in real-time
	// };

	// PythonShell.run("get_listentothis_hot_posts.py", options, function(err, results) {
	// 		if (err) res.redirect("back");
	// 		// results will be an array of the 50 hot posts from /r/listen to this


	// });
});

app.get("/playlist", middleware.isLoggedIn, function(req, res){

});

// // SHOW CREATE PLAYLIST FORM
// app.get("/playlist/", middleware.isLoggedIn, function(req, res){
// 	res.render("playlist/new");
// })


app.listen(3000, function() {
	console.log("Server running on localhost:" + port);
})
