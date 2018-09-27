# Class to manage REDDIT API
import praw, os
import pandas as pd
import datetime as dt


class redditAPI:
	def __init__(self, clientID, secret, appName, username, password):
		self.clientID = clientID
		self.secret = secret
		self.appName = appName
		self.username = username
		self.password = password
	def print_info(self):
		print(self.clientID)
		print(self.secret)
		print(self.appName)
		print(self.username)
		print(self.password)

		