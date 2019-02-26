require("dotenv").config();

var keys = require("./keys");

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);


var input = process.argv;

var instruction = input[2].trim();
var searchParam = "";

for (var i = 3; i < input.length; i++) {
    searchParam = searchParam + " " + input[i].trim();
};
searchParam = searchParam.trim();

switch (instruction) {
    case "concert-this":
        bandsInTownFunct(searchParam);
        break;
    case "spotify-this-song":
        spotifyFunct(searchParam);
        break;
    case "movie-this":
        omdbFunct(searchParam);
        break;
    case "do-what-it-says":
        fsFunct();
        break;
    case "?":
        helpFunct();
        break;
    default:
        console.log("'"+ instruction + " " + searchParam + "' is not a valid selection. Please type 'node liri.js ?' to see a list of acceptable commands");
        break;        
};

function bandsInTownFunct(text) {
    var queryURL = "https://rest.bandsintown.com/artists/" + text + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then( (response) => {
        var venueName = response.data[0].venue.name;
        var venueLocation = response.data[0].venue.city + " " + response.data[0].venue.region + " " + response.data[0].venue.country;
        var date = moment(response.data[0].datetime).format("MM/DD/YYYY, h:mm:ss a");
        console.log("Information about the next " + text + " concert:");
        console.log("Venue: " + venueName);
        console.log("Location: " + venueLocation);
        console.log("Date and time:" + date);
    });    
};

function spotifyFunct(text) {
    spotify.search({ type: 'track', query: text, limit:1 }).then((response) => {
        var artistName = response.tracks.items[0].artists[0].name;
        var albumName = response.tracks.items[0].album.name
        var previewUrl = response.tracks.items[0].external_urls.spotify;
        
        console.log ("Song: " + text);
        console.log("Artist/band: " + artistName);
        console.log("From the album: " + albumName);
        console.log("You can preview it at: " + previewUrl);       
    }).catch((err) => {
        console.log(err);
    });
};

function omdbFunct(text) {
    console.log(text);
};

function fsFunct() {
    console.log("random text");
};

function helpFunct(){
    console.log("List of acceptable commands:");
    console.log("node liri.js concert-this 'artist/band name here' ---> for information about your artists concert.");
    console.log("node liri.js spotify-this-song 'song name here' ---> for information about your song.");
    console.log("node liri.js movie-this 'movie name here' ---> for information about your movie.");
    console.log("node liri.js do-what-it-says ---> for other song information.");
    console.log("node liri.js ? ---> for help");
};



