# Song Scrape

This app will take genres that you like based on your top listened to artists on Spotify and scrape reddit's /r/listentothis posts to create a playlist for you, making discovering new songs and lesser known bands easier.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Setting up Environment Variables

Set up your own environment variables with the names given in app.py and give them your values in order for this to work on your own machine with your own reddit and spotify account. For example, go to Reddit's API and set REDDIT_SONG_SCRAPE_CLIENT_ID to your own client ID. Instructions for this can be found [here](http://www.storybench.org/how-to-scrape-reddit-with-python/). Do the same for spotify.

### Prerequisites

Install:
* homebrew
* Python 3
* pipenv
* npm
* node
```
Give examples
```

### Setup

```
pipenv --three install
node install
pipenv run node app.js
```

### How it Works

**Note** : If you have a playlist named "Listen to This" already. All of its tracks will be replaced with songs generated from the app. Please rename your playlist to avoid this.

1. User will authorize application to access user data and create a playlist. 
2. Once authorized, click 'Create Playlist' to start.
3. Application will look at the top 50 "hottest" posts from r/listentothis
4. Then, application will look at user's top listened to artists to generate a list of genres that the user likes.
5. Loop through 50 songs from r/listentothis and select the song if the genre is in user's preferred genres
6. Search for song in spotify and add it to a playlist called "Listen to this"

## Goals

* ~Authenticate user with Spotify account~
* ~Get list of genres that user likes~
* ~Scrape subreddit, find songs based on liked genres~
* ~Generate a spotify playlist of these songs (if on spotify)~
* ~Make this a web app~
* Stylize Web App
* Find songs with artists or titles with dashes in them
* Find songs with multiple genres listed on reddit. Also dashes between genres
