let {PythonShell} = require("python-shell");
// let pyshell = new PythonShell("get_listentothis_hot_posts.py");

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
};

PythonShell.run("get_listentothis_hot_posts.py", options, function(err, results) {
	if (err) throw err;
	// results will be an array of the 50 hot posts from /r/listen to this
});



