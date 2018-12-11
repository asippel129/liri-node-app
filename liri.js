require('dotenv').config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys");
var Spotify = require('node-spotify-api');


var action = process.argv[2];
var input = process.argv.slice(3).join("+");

//the switchcase that we will use based on what the user enters into the command line

switch (action) {
    case "concert-this":
        console.log("Searching for bands in town...");
        concert(input);
        break;
    case "spotify-this-song":
        console.log("Searching for songs...");
        spotify(input);
        break;
    case "movie-this":
        console.log("Searching for movies...");
        movie(input);
        break;
    case "do-what-it-says":
        doit();
        break;
};



function spotify(input) {

    var spotify = new Spotify(keys.spotify);
    if (!input) {
        input = 'The Sign';
    }
    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
    });
}

function movie(input) {
    var queryURL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
    axios.get(queryURL).then(function (response) {
        if (!input) {
            input = 'Mr Nobody';
        } else {

            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    });
}


function concert(input) {
    var queryURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function (response) {
        console.log("Title: " + JSON.parse(response)["Title"]);
    }
    )
};

function doit() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        if (dataArr[0] === "spotify-this-song") {

            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        }

    });

};
