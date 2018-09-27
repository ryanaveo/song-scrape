#! usr/bin/env python3
import praw, os
import pandas as pd
import datetime as dt
from api import reddit

appName = "song-scrape"


# ENVIRONMENT VARIABLES
redditClientID = os.environ.get("REDDIT_SONG_SCRAPE_CLIENT_ID")
redditSecret = os.environ.get("REDDIT_SONG_SCRAPE_SECRET")
redditUsername = os.environ.get("REDDIT_USER")
redditPassword = os.environ.get("REDDIT_PASS")

if __name__ == "__main__":
	redditAPI = reddit.redditAPI(redditClientID, redditSecret, appName, redditUsername, redditPassword)
	hotPosts = redditAPI.getHotPosts()
	for post in hotPosts:
		print(post.title)