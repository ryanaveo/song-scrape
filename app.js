const express = require("express"),
      app     = express(),
      port    = 3000,
      bodyParser = require("body-parser"),
      passport = require("passport"),
      session = require("express-session"),
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
		callbackURL: "http://localhost:3000/playlist"
	},
	function(accessToken, refreshToken, expires_in, profile, done) {
		console.log(profile);
		return done(null, profile);
	}))

app.use(session({
	secret: "avocado toast",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// AUTHENTICATE REQUEST FROM SPOTIFY
app.get("/auth/spotify", passport.authenticate("spotify", {
	scope: ["playlist-modify-private","user-top-read"],
	showDialog: true
}),
	function(req,res) {}
);

app.get("/callback", passport.authenticate("spotify", {failureRedirect: "/index"}), function(req, res){
	res.redirect("/");
})



// // GETTING REDDIT DATA
// let {PythonShell} = require("python-shell");
// // let pyshell = new PythonShell("get_listentothis_hot_posts.py");

// let options = {
//   mode: 'text',
//   pythonOptions: ['-u'], // get print results in real-time
// };

// PythonShell.run("get_listentothis_hot_posts.py", options, function(err, results) {
// 	if (err) throw err;
// 	// results will be an array of the 50 hot posts from /r/listen to this
// });


app.listen(3000, function() {
	console.log("Server running on localhost:" + port);
})
