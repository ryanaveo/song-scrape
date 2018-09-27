# Class to manage REDDIT API

import praw, os
import pandas as pd
import datetime as dt


class redditAPI:
	def __init__(self, clientID, secret, appName, username, password):
		# connect to reddit data 
		self._data = praw.Reddit(client_id=clientID, \
								client_secret=secret, \
								user_agent=appName,  \
								username=username,  \
								password=password)
		# access r/listentothis subreddit
		self._listentothis = self._data.subreddit("listentothis")
	def getHotPosts(self):
		'''
		returns a list of the top 50 hot posts on r/listentothis
		'''
		return self._listentothis.hot(limit=50)


		