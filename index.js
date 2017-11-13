var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP post parameters

// views is directory for all template files
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_tzhc8767:fk546i75vvo5i1n9lq5i1il45q@ds163020.mlab.com:63020/heroku_tzhc8767';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.enable('trust proxy');

app.use (function (req, res, next) {
    if (req.secure) {
            // request was via https, so do no special handling
            next();
    } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
    }
});


app.use(require('express').static(__dirname+'/www'));



app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'www') });
});

app.post('/submit', function(request, response) {
 	response.header("Access-Control-Allow-Origin", "*");
 	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var name = request.body.name;
    var short_desc = request.body.short_desc;
    var long_desc = request.body.long_desc;
    var lat = parseFloat(request.body.lat);
    var lng = parseFloat(request.body.lng);
    var photo = request.body.photo;

    // If the input is not correct
    if (name == undefined || short_desc == undefined) {
    	response.send('{"error":"Whoops, something is wrong with your data!"}');
    	return;
    }

    // Create a document to be added in to db
    var addInData = {
		"name": name,
		"short_desc": short_desc,
		"long_desc": long_desc,
		"lat": lat,
		"lng": lng,
		"photo": photo
	};

    addDocument(addInData, response);
});

app.get('/getdata', function(request, response) {
 	response.header("Access-Control-Allow-Origin", "*");
 	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 	sendData(response);
});



/*                                  */
/*                                  */
/* HELPER FUNCTIONS FOR POST/SUBMIT */
/*                                  */
/*                                  */

// First check whether the username has already existed in the db 
// If yes, update the data, if not, add a new entry
function addDocument(addInData, response) {
	db.collection("QuizData", function(error, coll) {
		coll.update(
			{name: addInData["name"]},
			{
				$set: {
					name: addInData["name"],
					short_desc: addInData["short_desc"],
					long_desc: addInData["long_desc"],
					lat: addInData["lat"],
					lng: addInData["lng"],
					photo: addInData["photo"],
				}
			},
			{ upsert: true }
		)
	});

	sendData(response);
}


function sendData(response)
{
	var returnJson = [];
	// Get all the document submited within 5 minutes from the given db
	db.collection("QuizData", function(er, collection) {
		collection.find().toArray(function(err, results) {
			if (!err) {
				for (var count = 0; count < results.length; count++) {
					returnJson.push(results[count]);
				}

				response.send(returnJson);
			}
		});
	});	
}

