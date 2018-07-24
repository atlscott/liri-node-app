require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var params = {
    //Twitter @ name. Change screen name to see different tweets
    screen_name: 'atldawg1',
    result_type: 'recent',
    lang: 'en'
}


var command = process.argv[2];
var input = process.argv[3];

//must take in one of the following commands:
//* `my-tweets`
//* `spotify-this-song`
//* `movie-this`
//* `do-what-it-says`

//switch case for each command
switch (command) {
    case "my-tweets":
    tweets();
    break;

    case "spotify-this-song":
    song();
    break;

    case "movie-this":
    movie();
    break;

    case "do-what-it-says":
    whatItSays();
    break;
};

//'my-tweets - show/grab last 20 tweets
//client.get(path, params, callback);
function tweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log('Error Occurred: ' + error);
          }
        let username = params.screen_name;
        console.log("Twitter Username: " + username);
        for (var i = 0; i < 20; i++){
            console.log("# " + (i + 1) + ": " + JSON.parse(response.body)[i].text);
        }
    });
}

//'spotify-this-song' - show:
//Artist, title, preview link from Spotify
//the album for the song
//no song provided - default to Ace of Base - The Sign.

function song() {
    if (!input) {
        input = "The Sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artists: " + data.tracks.items[0].artists[0].name);
        console.log("Title: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name+"\n--------");
    });
}

//'movie-this - output the following:
//Title, Year, IMDB Rating, Rotten Tomatoes Rating
//Country, Language, Plot, Actors
//no movie entered = 'Mr Nobody' movie data

function movie() {
    if (!input) {
        input = "Mr Nobody"
    }
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + input, function (error, response, body) {
        if (error) {
            return console.log(error);
        } else if (response.statusCode === 200) {
        console.log("Title: " + JSON.parse(response.body).Title);
        console.log("Year Released: " + JSON.parse(response.body).Year);
        console.log("IMDB Rating: " + JSON.parse(response.body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(response.body).Ratings[1]);
        console.log("Country: " + JSON.parse(response.body).Country);
        console.log("Language: " + JSON.parse(response.body).Language);
        console.log("Plot: " + JSON.parse(response.body).Plot);
        console.log("Actors: " + JSON.parse(response.body).Actors+"\n-------");
        }
    });
};

//'do-what-it-says' - should pull text from random.txt file
// then use the text to run a command:
//my-tweets | spotify-this-song | movie-this

function whatItSays() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        command = data.split(",");
        input = data.split(",");

        switch (dataArr[0]){
            case "my-tweets":
            tweets();
            break;

            case "spotify-this-song":
            song();
            break;

            case "movie-this":
            movie();
            break;
        }
    });
};

