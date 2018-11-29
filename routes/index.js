var express = require('express');
var router = express.Router();

// const axios = require('axios');
// var apiUrl = "https://api.vitalsource.com/v4/products/";
// var pokemonName = document.querySelector(".pokemon-name");

// var config = {
//     headers: {
//         'Content-Type': 'application/json',
//         'X-VitalSource-API-Key': 'DQT6HRBYXD6W5E23',
//         'Accept': 'application/json',

//         'Cache-Control': 'no-cache'
//     }
// };

// var details = require('./details');
// const {OperationHelper} = require('apac');

// var opHelper = new OperationHelper({
//     awsId : details.AccessId,
//     awsSecret : details.Secret,
//     assocId : details.Tag,
//     locale : ''
// });

// // amazon
// router.get('/', function(req, res){
//     // res.render('index');
//     opHelper.execute('ItemSearch', {
//         'SearchIndex': 'Books',
//         'Keywords': 'harry potter',
//         'ResponseGroup': 'ItemAttributes,Offers'
//       }).then((response) => {
//         //   console.log("Results object: ", response.result);
//         //   console.log("Raw response body: ", response.responseBody);
//         res.send(response.result);
//       }).catch((err) => {
//           console.error("Something went wrong! ", err);
//       });
// });

// Get Homepage
router.get('/', function (req, res) {
    res.render('index');
});



// How It Works
router.get('/How-It-Works', function (req, res) {
    res.render('how');
});

// Sell Books
router.get('/Sell-Books', function (req, res) {
    res.render('sell');
});

// Buy Books
router.get('/Buy-Books',  function (req, res) {
    res.render('buy');
    
});

// News 
router.get('/News', function (req, res) {
    res.render('news');
});

// Help And Safety 
router.get('/Help-And-Safety', function (req, res) {
    res.render('help');
});

// Rent 
router.get('/Rent', function (req, res) {
    res.render('Rent');
});

// contact 
router.get('/Contact', function (req, res) {
    res.render('contact');
});

// about
router.get('/About', function (req, res) {
    res.render('About');
});


// function getPokemonData() {
//     axios.get(apiUrl, config)
//         .then(function (response) {
//             pokemonName.innerHTML = response.data;

//         })
//         .catch(function (error) {
//             pokemonName.innerHTML = "(An error has occurred.)";
//             pokemonImage.src = "";
//         });
// };

module.exports = router;