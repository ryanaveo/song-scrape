#! usr/bin/env python3
import praw, os
import pandas as pd
import datetime as dt
from api import reddit

clientID = os.environ.get("SONG_SCRAPE_CLIENT_ID")
secret = os.environ.get("SONG_SCRAPE_SECRET")
appName = "song-scrape"
username = os.environ.get("REDDIT_USER")
password = os.environ.get("REDDIT_PASS")

if __name__ == "__main__":
	redditAPI = reddit.redditAPI(clientID, secret, appName, username, password)