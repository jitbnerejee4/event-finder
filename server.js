const express= require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const ngeohash = require('ngeohash')
const path = require('path')
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors({origin: true, credentials: true}))
app.use(express.static(path.join(__dirname, 'dist/hw8')))


app.get('/:keyword/:distance/:category/:lat/:long',(req,res)=>{
    const geo = ngeohash.encode(req.params.lat, req.params.long)
    let segmentID = ""
    if(req.params.category == 'Music')
        segmentID = 'KZFzniwnSyZfZ7v7nJ'
    else if(req.params.category == 'Sports')
        segmentID= 'KZFzniwnSyZfZ7v7nE'
    else if(req.params.category == 'Arts & Theatre')
        segmentID = 'KZFzniwnSyZfZ7v7na'
    else if(req.params.category == 'Film')
        segmentID = 'KZFzniwnSyZfZ7v7nn'
    else if(req.params.category == 'Miscellaneous')
        segmentID = 'KZFzniwnSyZfZ7v7n1'
    else{
        segmentID = ""
    }
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=&keyword=${req.params.keyword}&segmentId=${segmentID}&radius=${req.params.distance}&unit=miles&geoPoint=${geo}`)
    .then((response)=>response.json())
    .then((response)=>{
        res.send({response: response})
    })
})
app.get('/:eventid', (req,res)=>{
    fetch(`https://app.ticketmaster.com/discovery/v2/events/${req.params.eventid}?apikey=`)
    .then((response)=>response.json())
    .then((response)=>{
        res.send({response: response})
    })
})

app.get('/suggest/:keyword', (req, res)=>{
    fetch(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=&keyword=${req.params.keyword}`)
    .then((response)=>response.json())
    .then((response)=>{
        res.send({response: response})
    })
})

app.get('/artist/:artistname', (req, res)=>{

    var spotifyApi = new SpotifyWebApi({
        clientId: '',
        clientSecret: '',
    });
    
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token is ' + data.body['access_token']);
          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.searchArtists(`${req.params.artistname}`)
          .then(response=>{
              res.send({response: response})
          })
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
    );
})
app.get('/artist/album/:artistid', (req, res)=>{
    var spotifyApi = new SpotifyWebApi({
        clientId: '',
        clientSecret: '',
    });

    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token is ' + data.body['access_token']);
          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.getArtistAlbums(`${req.params.artistid}`, {limit: 3})
          .then(response=>{
              res.send({response: response})
          })
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
    );
})

app.get('/venue/:venuename', (req, res)=>{
    fetch(`https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${req.params.venuename}&apikey=`)
    .then((response)=>response.json())
    .then((response)=>{
        res.send({response: response})
    })
})

const port= process.env.PORT || 3080;

app.listen(port, () =>{
    console.log(`Server started at ${port}`);
})
