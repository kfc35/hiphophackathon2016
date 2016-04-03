# hiphophackathon2016
![](http://i.imgur.com/uUGKpwG.png?1)


Owners:
chen.kevin.f@gmail.com
jason.k.chen@gmail.com


This project is a vomit pass at tracking the constantly evolving relationship between rap music and fashion.  As flavors change from Cazel's and shell-toes in the nascent days of rap (think Run DMC) to the modern obsessions with Yves Saint Laurent and Yeezy boosts (think, our lord and savior, Yeezus), we though it would be cool to be able to quantitatively track fashion trends and popularity as it applies to rap culture.

## Technical Details
Project set up with Node Express, and written using Node.js
Brand data can be found in the `/public` directory. Lyrical data can be found in the `/public/lyrics` directory.
Logic can be found in the `/routes` directory. Specifically, the `d3service` concerns rendering the bubble graph. `lyricsProcessingService` parses lyrics for brand counts.

## Local Development
- Go to the root folder, and run `npm start` to start up the server.
- A list of available paths are found in `app.js`. e.g. `localhost:3000/lyricsData` loads the parsed lyric data, complete with brand mentions.
