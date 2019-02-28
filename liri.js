require("dotenv").config();

var keys = require("./keys");

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);


var input = process.argv;

var operation = input[2].trim();
var queryParam = "";

for (var i = 3; i < input.length; i++) {
    queryParam = queryParam + " " + input[i].trim();
};
queryParam = queryParam.trim();

runProgram(operation, queryParam);



function runProgram(instruction, searchParam) {

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
    }).catch((error) => {
        console.log(error);
    });    
};

function spotifyFunct(text) {
    var song = "The Sign";
    if (text){
        song = text;
        spotify.search({ type: 'track', query: song, limit:10 }).then((response) => {
            var responseArr = response.tracks.items;

            console.log("\nTop ten results for your " + song + " query:");
            
            responseArr.forEach( (element) => {
                var songName = element.name;
                var artistName = element.artists[0].name;
                var albumName = element.album.name;
                var previewUrl = element.external_urls.spotify;

                console.log ("\nSong: " + songName);
                console.log("Artist/band: " + artistName);
                console.log("From the album: " + albumName);
                console.log("You can preview it at: " + previewUrl);
                console.log("----------------------------------------");
            });        
                
        }).catch((err) => {
            console.log(err);
        });
    } else{
        spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE'). then((response) => {
            var songName = response.name;
            var artistName = response.artists[0].name;
            var albumName = response.album.name;
            var previewUrl = response.external_urls.spotify;

            console.log ("\nSong: " + songName);
            console.log("Artist/band: " + artistName);
            console.log("From the album: " + albumName);
            console.log("You can preview it at: " + previewUrl);
            console.log("----------------------------------------");
        });
    }
};

function omdbFunct(text) {
    var title = "Mr. Nobody";
    if(text){
        title = text;
    } else{
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };

    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t="+title;
    axios.get(queryURL).then((doc) => {
        var response = doc.data;
       
        var movieTitle = response.Title;
        var movieYear = response.Year;
        var movieIMDB = response.Ratings[0].Value;
        var movieTomatoes = response.Ratings[1].Value;
        var movieCountry = response.Country;
        var movieLanguage = response.Language;
        var moviePlot = response.Plot;
        var movieActors = response.Actors;
        console.log("Title: ", movieTitle);
        console.log("Year: ", movieYear);
        console.log("IMDB Rating: ", movieIMDB);
        console.log("Rotten Tomatoes Rating: ", movieTomatoes);
        console.log("Country: ", movieCountry);
        console.log("Language: ", movieLanguage);
        console.log("Plot: ", moviePlot);
        console.log("Actors: ", movieActors);
    }).catch((error) => {
        console.log(error);
    });
    
};

function fsFunct() {
    var textArr = [];
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        textArr = data.split(",");
        var param1 = textArr[0];
        var param2 = textArr[1].slice(1,-1);

        if (param1 === "do-what-it-says"){
            return console.log("ERROR: The instrucion on random.txt is " + param1 + ". This will create an infinite loop, please modify the file.");
        };
        
        runProgram(param1, param2);
    })   
};

function helpFunct(){
    console.log("List of acceptable commands:");
    console.log("node liri.js concert-this 'artist/band name here' ---> for information about your artists concert.");
    console.log("node liri.js spotify-this-song 'song name here' ---> for information about your song.");
    console.log("node liri.js movie-this 'movie name here' ---> for information about your movie.");
    console.log("node liri.js do-what-it-says ---> for other song information.");
    console.log("node liri.js ? ---> for help");
};



