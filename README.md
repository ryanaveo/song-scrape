# Song Scrape

This app will take genres that you like and scrape reddit's /r/listentothis to make discovering new songs easier for you. These songs will be put in a spotify playlist for you.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Setting up Environment Variables

Set up your own environment variables with the names given in app.py and give them your values in order for this to work on your own machine with your own reddit and spotify account. For example, go to Reddit's API and set REDDIT_SONG_SCRAPE_CLIENT_ID to your own client ID. Instructions for this can be found [here](http://www.storybench.org/how-to-scrape-reddit-with-python/). Do the same for spotify.

### Prerequisites

Install:
* homebrew
* Python 3
* pipenv run python app.py
```
Give examples
```

### Setup

```
pipenv --three install
pipenv run python app.py
```

## Goals

* Authenticate user with Spotify account
* Get list of genres that user likes
* Scrape subreddit, find songs I haven't listened to before based on liked genres
* generate a spotify playlist of these songs (if on spotify)
* Make this a web app
