const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(bodyParser.json())

// All your handlers here...
var db;

var mongourl = 'mongodb://localhost:27017/node_crud';

MongoClient.connect(mongourl, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/test', function(req, res) {
  res.send('Hello World')
})
// Note: request and response are usually written as req and res respectively.

app.get('/', (req, res) => {
 
  var cursor = db.collection('quotes').find().toArray(function(err, results) {
	  console.log(results)
	  // send HTML file populated with quotes here
	
		  res.render('index.ejs', {quotes: results})
	 
	})
	
})

app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
})
app.put('/quotes', (req, res) => {
	db.collection('quotes')
	  .findOneAndUpdate({name: 'Yoda'}, {
		$set: {
		  name: req.body.name,
		  quote: req.body.quote
		}
	  }, {
		sort: {_id: -1},
		upsert: true
	  }, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
