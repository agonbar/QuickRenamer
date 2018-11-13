var fs = require('fs');
const axios = require('axios')

const FilmaffinitySearch = require('filmaffinity-search');
const getIds = FilmaffinitySearch.getIds;

const FFMpeg = require('ffmpeg-wrap').FFMpeg;

var config = require('./config.json');

const path = "./test/exampleFiles";
var token = "a";
axios.post("https://api.thetvdb.com/login", {"apikey": config.thetvdb}).then(function (response) {
        token = response.data.token;
        fs.readdir(path, function (err, items) {
            console.log(err);
            var patt = /([0-9]+x[0-9]+)/g;
        
            items.forEach(item => {
        
                const instance = axios.create({
                    baseURL: 'https://api.thetvdb.com/search',
                    timeout: 1000,
                    headers: {
                        'Authorization': 'Bearer '+token,
                        "Accept": "application/json",
                        'Accept-Language': 'es'
                    }
                });
                instance.get("series?name="+item.split("[")[0].split(" ").filter(e => !patt.test(e)).join(" "), {
                        timeout: 5000
                    }).then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
        
                getIds(item.split("[")[0])
                    .then((films) => films.forEach(( film ) => console.log(item+ ":" + JSON.stringify(film, null, 4))));
            });
        });
    }).catch(function (error) {
        console.log(error);
    });